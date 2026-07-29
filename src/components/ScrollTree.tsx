/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from 'motion/react';
import { useMediaQuery } from '../lib/useMediaQuery';

/**
 * A tree that gets taken down while you read the page.
 *
 * Lives in the empty right-hand margin on wide screens and doubles as a reading
 * progress indicator: the cut marker slides down the trunk as you scroll, and
 * each milestone removes another part of the tree. Ends on a sprout — the yard
 * is cleared and something new starts growing.
 *
 * Purely decorative: aria-hidden, pointer-events-none, never mounted below xl,
 * and reduced to a still drawing when the visitor asks for less motion.
 */

const VIEWBOX_W = 120;
const VIEWBOX_H = 400;
const TRUNK_X = 60;
const GROUND_Y = 372;
const CUT_WINDOW = 0.06;

/**
 * motion resolves originX/originY as a fraction of the transform box, not as
 * pixels, so viewBox coordinates have to be normalised before they are handed
 * over. Passing `transformOrigin` directly does not work — motion overwrites it
 * with its own computed value.
 */
const pivot = (x: number, y: number) =>
  ({ originX: x / VIEWBOX_W, originY: y / VIEWBOX_H, transformBox: 'view-box' }) as const;

interface BranchConfig {
  id: string;
  /** Attachment point on the trunk. */
  x: number;
  y: number;
  length: number;
  side: 'left' | 'right';
  /** Scroll progress at which this branch comes off. */
  cutAt: number;
}

/**
 * Thresholds are tuned to where the sections actually sit in scroll progress:
 * services 0.21, calculator 0.40, gallery 0.55, reviews 0.69, proof band 0.78,
 * FAQ 0.89, CTA 0.98. Re-measure after adding or removing a section.
 */
const BRANCHES: BranchConfig[] = [
  { id: 'b1', x: 63, y: 88, length: 46, side: 'right', cutAt: 0.1 },
  { id: 'b2', x: 57, y: 128, length: 42, side: 'left', cutAt: 0.21 },
  { id: 'b3', x: 64, y: 176, length: 50, side: 'right', cutAt: 0.38 },
  { id: 'b4', x: 56, y: 222, length: 46, side: 'left', cutAt: 0.54 },
  { id: 'b5', x: 65, y: 268, length: 40, side: 'right', cutAt: 0.67 }
];

/** Tree comes down over the proof band, gets ground away during the FAQ. */
const TRUNK_CUT_AT = 0.76;
const STUMP_GRIND_AT = 0.87;
const SPROUT_AT = 0.96;

function branchPath({ x, y, length, side }: BranchConfig) {
  const dir = side === 'right' ? 1 : -1;
  const tipX = x + dir * length;
  const tipY = y - length * 0.5;
  return `M${x},${y} C${x + dir * length * 0.35},${y - length * 0.08} ${x + dir * length * 0.62},${y - length * 0.3} ${tipX},${tipY}`;
}

function twigPaths({ x, y, length, side }: BranchConfig) {
  const dir = side === 'right' ? 1 : -1;
  const midX = x + dir * length * 0.55;
  const midY = y - length * 0.26;
  const tipX = x + dir * length;
  const tipY = y - length * 0.5;
  return [
    `M${midX},${midY} L${midX + dir * length * 0.18},${midY - length * 0.3}`,
    `M${tipX - dir * length * 0.2},${tipY + length * 0.1} L${tipX - dir * length * 0.05},${tipY - length * 0.22}`
  ];
}

function Sawdust({ progress, config }: { progress: MotionValue<number>; config: BranchConfig }) {
  const start = config.cutAt;
  const end = config.cutAt + CUT_WINDOW;
  const opacity = useTransform(progress, [start, start + 0.012, end], [0, 0.9, 0]);
  const y = useTransform(progress, [start, end], [0, 26]);

  const specks = [-7, -3, 0, 4, 8, 11];

  return (
    <motion.g style={{ y, opacity }} aria-hidden="true">
      {specks.map((offset, index) => (
        <circle
          key={offset}
          cx={config.x + offset}
          cy={config.y + (index % 3) * 2.5}
          r={index % 2 === 0 ? 1.5 : 1}
          fill="var(--color-bark-600)"
        />
      ))}
    </motion.g>
  );
}

function Branch({ progress, config }: { progress: MotionValue<number>; config: BranchConfig }) {
  const start = config.cutAt;
  const end = config.cutAt + CUT_WINDOW;
  const tilt = config.side === 'right' ? 72 : -72;

  const rotate = useTransform(progress, [start, end], [0, tilt]);
  const y = useTransform(progress, [start, end], [0, 150]);
  const opacity = useTransform(progress, [start, start + CUT_WINDOW * 0.7, end], [1, 0.9, 0]);

  const dir = config.side === 'right' ? 1 : -1;
  const tipX = config.x + dir * config.length;
  const tipY = config.y - config.length * 0.5;

  return (
    <motion.g
      // Pivot on the point where the branch meets the trunk.
      style={{ rotate, y, opacity, ...pivot(config.x, config.y) }}
    >
      <path
        d={branchPath(config)}
        stroke="var(--color-bark-700)"
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
      />
      {twigPaths(config).map((d) => (
        <path key={d} d={d} stroke="var(--color-bark-600)" strokeWidth={1.8} strokeLinecap="round" fill="none" />
      ))}

      {/* Foliage */}
      <ellipse cx={tipX - dir * 4} cy={tipY - 2} rx={13} ry={9} fill="var(--color-forest-500)" opacity={0.9} />
      <ellipse cx={tipX - dir * 15} cy={tipY + 7} rx={10} ry={7} fill="var(--color-forest-600)" opacity={0.85} />
      <ellipse cx={tipX + dir * 3} cy={tipY + 6} rx={7} ry={5.5} fill="var(--color-forest-400)" opacity={0.8} />
    </motion.g>
  );
}

const TRUNK_PATH = `M${TRUNK_X - 10},${GROUND_Y}
  C${TRUNK_X - 9},300 ${TRUNK_X - 7},200 ${TRUNK_X - 5},120
  C${TRUNK_X - 4},80 ${TRUNK_X - 4},56 ${TRUNK_X - 3},40
  L${TRUNK_X + 3},40
  C${TRUNK_X + 4},56 ${TRUNK_X + 4},80 ${TRUNK_X + 5},120
  C${TRUNK_X + 7},200 ${TRUNK_X + 9},300 ${TRUNK_X + 10},${GROUND_Y} Z`;

/**
 * The climber. Hangs on the left of the trunk, rides down from branch to branch
 * and does the cutting — the branches used to just fall off on their own, which
 * read as the tree falling apart rather than as work being done.
 *
 * `sawing` runs the chainsaw wobble; it stops once there is nothing left to cut.
 */
function Climber({ sawing }: { sawing: boolean }) {
  // Drawn in local units around (0, 0) = where the saw meets the trunk, then
  // scaled up as a whole. At 1:1 in viewBox units the figure came out ~14px on
  // screen and the helmet collapsed into a dot.
  return (
    <g transform={`translate(${TRUNK_X - 5} 0) scale(1.7)`}>
      {/* Safety line back around the trunk */}
      <path
        d="M-15,-3 C-9,-7 -3,-7 1,-4"
        stroke="var(--color-safety-400)"
        strokeWidth={0.9}
        strokeLinecap="round"
        fill="none"
        opacity={0.9}
      />

      {/* Legs braced against the trunk — the feet have to land past x=0, which
          is the trunk's left edge, otherwise he reads as floating beside it. */}
      <path d="M-15,4 L-6,2 L2,2" stroke="var(--color-forest-900)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-15,6 L-7,8 L2,7" stroke="var(--color-forest-900)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Harness */}
      <path d="M-17,3 L-14,4" stroke="var(--color-safety-600)" strokeWidth={1.6} strokeLinecap="round" />

      {/* Torso */}
      <path d="M-18,-3 L-16,5" stroke="var(--color-safety-500)" strokeWidth={5} strokeLinecap="round" />

      {/* Helmet with brim */}
      <circle cx={-19} cy={-8} r={3.2} fill="var(--color-safety-500)" />
      <path d="M-22.5,-9 L-15.5,-9" stroke="var(--color-safety-600)" strokeWidth={1.3} strokeLinecap="round" />

      {/* Arms + chainsaw, biting into the trunk */}
      <g
        className={sawing ? 'animate-saw' : undefined}
        style={{ transformBox: 'fill-box', transformOrigin: '20% 50%' }}
      >
        <path d="M-16,-1 L-11,0" stroke="var(--color-safety-500)" strokeWidth={2.4} strokeLinecap="round" />
        <rect x={-12} y={-2.6} width={5.2} height={5.2} rx={1.3} fill="var(--color-forest-900)" />
        <path d="M-7,0 L0,0" stroke="var(--color-ink-300)" strokeWidth={1.8} strokeLinecap="round" />
      </g>
    </g>
  );
}

function StaticTree() {
  return (
    <g>
      <path d={TRUNK_PATH} fill="var(--color-bark-700)" />
      {BRANCHES.map((config) => {
        const dir = config.side === 'right' ? 1 : -1;
        const tipX = config.x + dir * config.length;
        const tipY = config.y - config.length * 0.5;
        return (
          <g key={config.id}>
            <path
              d={branchPath(config)}
              stroke="var(--color-bark-700)"
              strokeWidth={4.5}
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx={tipX - dir * 4} cy={tipY - 2} rx={13} ry={9} fill="var(--color-forest-500)" opacity={0.9} />
            <ellipse cx={tipX - dir * 15} cy={tipY + 7} rx={10} ry={7} fill="var(--color-forest-600)" opacity={0.85} />
          </g>
        );
      })}
      <g transform={`translate(0 ${BRANCHES[0].y})`}>
        <Climber sawing={false} />
      </g>
    </g>
  );
}

export default function ScrollTree() {
  const shouldReduceMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 1280px)');
  const { scrollYProgress } = useScroll();
  const [isFelled, setIsFelled] = useState(false);
  const [isWorking, setIsWorking] = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const felled = latest > BRANCHES[0].cutAt;
    setIsFelled((current) => (current === felled ? current : felled));
    const working = latest < SPROUT_AT;
    setIsWorking((current) => (current === working ? current : working));
  });

  // Trunk drops away once the crown is gone.
  const trunkY = useTransform(scrollYProgress, [TRUNK_CUT_AT, TRUNK_CUT_AT + CUT_WINDOW], [0, 210]);
  const trunkRotate = useTransform(scrollYProgress, [TRUNK_CUT_AT, TRUNK_CUT_AT + CUT_WINDOW], [0, 16]);
  const trunkOpacity = useTransform(
    scrollYProgress,
    [TRUNK_CUT_AT, TRUNK_CUT_AT + CUT_WINDOW * 0.8, TRUNK_CUT_AT + CUT_WINDOW],
    [1, 0.85, 0]
  );

  // Stump appears at the cut, then gets ground down by the stump grinder.
  const stumpOpacity = useTransform(
    scrollYProgress,
    [TRUNK_CUT_AT, TRUNK_CUT_AT + 0.02, STUMP_GRIND_AT, STUMP_GRIND_AT + CUT_WINDOW],
    [0, 1, 1, 0]
  );
  const stumpScale = useTransform(scrollYProgress, [STUMP_GRIND_AT, STUMP_GRIND_AT + CUT_WINDOW], [1, 0.2]);
  const grindDust = useTransform(
    scrollYProgress,
    [STUMP_GRIND_AT, STUMP_GRIND_AT + 0.02, STUMP_GRIND_AT + CUT_WINDOW],
    [0, 0.8, 0]
  );

  // And something new starts growing.
  const sproutScale = useTransform(scrollYProgress, [SPROUT_AT, 1], [0, 1]);
  const sproutOpacity = useTransform(scrollYProgress, [SPROUT_AT, SPROUT_AT + 0.02], [0, 1]);

  // The climber rides down the trunk, stopping at each branch he is about to
  // cut, and ends up at the stump. Doubles as the reading progress indicator.
  const climberY = useTransform(
    scrollYProgress,
    [0, BRANCHES[0].cutAt, BRANCHES[1].cutAt, BRANCHES[2].cutAt, BRANCHES[3].cutAt, BRANCHES[4].cutAt, TRUNK_CUT_AT, STUMP_GRIND_AT],
    [BRANCHES[0].y, BRANCHES[0].y, BRANCHES[1].y, BRANCHES[2].y, BRANCHES[3].y, BRANCHES[4].y, GROUND_Y - 32, GROUND_Y - 16]
  );
  const climberOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, SPROUT_AT - 0.02, SPROUT_AT],
    [0, 1, 1, 0]
  );

  /** Everything that rotates or scales pivots on the base of the trunk. */
  const basePivot = pivot(TRUNK_X, GROUND_Y);

  if (!isWide) return null;

  return (
    <div
      id="scroll-tree"
      aria-hidden="true"
      className="pointer-events-none fixed right-2 2xl:right-8 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      {/* Wider than strictly needed for the tree: at 86px the climber's helmet
          collapsed into a dot. */}
      <svg viewBox="0 0 120 400" className="h-[68vh] w-[124px]" fill="none" role="presentation">
        {/* Ground */}
        <line
          x1={20}
          y1={GROUND_Y}
          x2={100}
          y2={GROUND_Y}
          stroke="var(--color-forest-300)"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />

        {shouldReduceMotion ? (
          <StaticTree />
        ) : (
          <>
            <g
              className={isFelled ? undefined : 'animate-sway'}
              style={{ transformBox: 'view-box', transformOrigin: `${TRUNK_X}px ${GROUND_Y}px` }}
            >
              <motion.g style={{ y: trunkY, rotate: trunkRotate, opacity: trunkOpacity, ...basePivot }}>
                <path d={TRUNK_PATH} fill="var(--color-bark-700)" />
                {/* Bark texture */}
                <path
                  d={`M${TRUNK_X - 3},70 C${TRUNK_X - 4},150 ${TRUNK_X - 5},250 ${TRUNK_X - 6},340`}
                  stroke="var(--color-bark-900)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  opacity={0.45}
                />
                <path
                  d={`M${TRUNK_X + 2},90 C${TRUNK_X + 3},170 ${TRUNK_X + 5},260 ${TRUNK_X + 6},350`}
                  stroke="var(--color-bark-900)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  opacity={0.35}
                />

                {BRANCHES.map((config) => (
                  <Branch key={config.id} progress={scrollYProgress} config={config} />
                ))}
              </motion.g>

              {BRANCHES.map((config) => (
                <Sawdust key={`dust-${config.id}`} progress={scrollYProgress} config={config} />
              ))}
            </g>

            {/* The climber doing the cutting — also the progress indicator */}
            <motion.g style={{ y: climberY, opacity: climberOpacity }}>
              <Climber sawing={isWorking} />
            </motion.g>

            {/* Stump with growth rings */}
            <motion.g style={{ opacity: stumpOpacity, scale: stumpScale, ...basePivot }}>
              <path
                d={`M${TRUNK_X - 11},${GROUND_Y} C${TRUNK_X - 10},358 ${TRUNK_X - 9},348 ${TRUNK_X - 9},344 L${TRUNK_X + 9},344 C${TRUNK_X + 9},348 ${TRUNK_X + 10},358 ${TRUNK_X + 11},${GROUND_Y} Z`}
                fill="var(--color-bark-800)"
              />
              <ellipse cx={TRUNK_X} cy={344} rx={9} ry={3.4} fill="var(--color-bark-100)" />
              <ellipse cx={TRUNK_X} cy={344} rx={6} ry={2.2} fill="none" stroke="var(--color-bark-600)" strokeWidth={0.7} />
              <ellipse cx={TRUNK_X} cy={344} rx={3} ry={1.1} fill="none" stroke="var(--color-bark-600)" strokeWidth={0.7} />
            </motion.g>

            {/* Grinder dust */}
            <motion.g style={{ opacity: grindDust }}>
              {[-14, -8, -2, 5, 11, 16].map((offset, index) => (
                <circle
                  key={offset}
                  cx={TRUNK_X + offset}
                  cy={GROUND_Y - 6 - (index % 3) * 4}
                  r={index % 2 === 0 ? 2 : 1.4}
                  fill="var(--color-bark-600)"
                />
              ))}
            </motion.g>

            {/* New growth */}
            <motion.g style={{ opacity: sproutOpacity, scale: sproutScale, ...basePivot }}>
              {/* Lighter greens than the rest of the tree: the sprout lands over
                  the dark CTA and footer, where forest-500 disappears. */}
              <path
                d={`M${TRUNK_X},${GROUND_Y} L${TRUNK_X},${GROUND_Y - 22}`}
                stroke="var(--color-forest-300)"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
              <ellipse
                cx={TRUNK_X - 8}
                cy={GROUND_Y - 20}
                rx={8.5}
                ry={4.8}
                fill="var(--color-forest-300)"
                transform={`rotate(-24 ${TRUNK_X - 8} ${GROUND_Y - 20})`}
              />
              <ellipse
                cx={TRUNK_X + 8}
                cy={GROUND_Y - 25}
                rx={8}
                ry={4.5}
                fill="var(--color-forest-400)"
                transform={`rotate(22 ${TRUNK_X + 8} ${GROUND_Y - 25})`}
              />
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}
