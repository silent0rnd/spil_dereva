/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion, useScroll } from 'motion/react';
import { useMediaQuery } from '../lib/useMediaQuery';

/**
 * A tree that gets taken down while you read the page.
 *
 * Lives in the empty right-hand margin on wide screens and doubles as a reading
 * progress indicator: the climber rides down the trunk as you scroll, and each
 * milestone removes another part of the tree. Ends on a sprout — the yard is
 * cleared and something new starts growing.
 *
 * Purely decorative: aria-hidden, pointer-events-none, never mounted below xl,
 * and reduced to a still drawing when the visitor asks for less motion.
 *
 * Driven by one rAF loop that writes `transform`/`opacity` straight onto the
 * SVG nodes, not by `useTransform`. The impacts — the shudder before a branch
 * lets go, the recoil that rings through the trunk after it does, the chip
 * burst — are functions of TIME since the cut, not of scroll position, and a
 * MotionValue chain cannot express that. Scroll progress is still the clock:
 * it is read with `scrollYProgress.get()` inside the loop.
 */

const VIEWBOX_W = 120;
const VIEWBOX_H = 400;
const TRUNK_X = 60;
const GROUND_Y = 372;
const CUT_WINDOW = 0.06;

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

/** How far up the trunk the climbing line is anchored. */
const ANCHOR_X = 57;
const ANCHOR_Y = 44;

const CLIMBER_SCALE = 1.8;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
/** Normalised position of `p` inside the [a, b] window. */
const inv = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

const TRUNK_PATH = `M${TRUNK_X - 10},${GROUND_Y}
  C${TRUNK_X - 9},300 ${TRUNK_X - 7},200 ${TRUNK_X - 5},120
  C${TRUNK_X - 4},80 ${TRUNK_X - 4},56 ${TRUNK_X - 3},40
  L${TRUNK_X + 3},40
  C${TRUNK_X + 4},56 ${TRUNK_X + 4},80 ${TRUNK_X + 5},120
  C${TRUNK_X + 7},200 ${TRUNK_X + 9},300 ${TRUNK_X + 10},${GROUND_Y} Z`;

function BranchArt({ config }: { config: BranchConfig }) {
  const dir = config.side === 'right' ? 1 : -1;
  const tipX = config.x + dir * config.length;
  const tipY = config.y - config.length * 0.5;
  return (
    <>
      <path d={branchPath(config)} stroke="var(--color-bark-700)" strokeWidth={4.5} strokeLinecap="round" fill="none" />
      {twigPaths(config).map((d) => (
        <path key={d} d={d} stroke="var(--color-bark-600)" strokeWidth={1.8} strokeLinecap="round" fill="none" />
      ))}
      <ellipse cx={tipX - dir * 4} cy={tipY - 2} rx={13} ry={9} fill="var(--color-forest-500)" opacity={0.9} />
      <ellipse cx={tipX - dir * 15} cy={tipY + 7} rx={10} ry={7} fill="var(--color-forest-600)" opacity={0.85} />
      <ellipse cx={tipX + dir * 3} cy={tipY + 6} rx={7} ry={5.5} fill="var(--color-forest-400)" opacity={0.8} />
    </>
  );
}

/**
 * The climber. Hangs on the left of the trunk on his line, rides down from
 * branch to branch and does the cutting.
 *
 * Drawn in local units around (0, 0) = where the saw meets the trunk, then
 * scaled up as a whole; the rAF loop positions and tilts the outer <g>. At 1:1
 * in viewBox units the figure came out ~14px on screen and the helmet collapsed
 * into a dot.
 */
function Climber() {
  return (
    <>
      {/* Legs braced against the trunk — the feet have to land past x=0, which
          is the trunk's left edge, otherwise he reads as floating beside it. */}
      <path d="M-11,3.5 L-5.5,1 L1,2" stroke="var(--color-forest-900)" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-11,4.6 L-5,5.6 L1,6.6" stroke="var(--color-forest-950)" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Spiked boots biting the bark */}
      <ellipse cx={1.6} cy={2} rx={1.5} ry={1.1} fill="var(--color-forest-950)" />
      <ellipse cx={1.6} cy={6.6} rx={1.5} ry={1.1} fill="var(--color-forest-950)" />
      <path d="M2.4,1.6 L3.6,2.4" stroke="var(--color-ink-300)" strokeWidth={0.6} strokeLinecap="round" />
      <path d="M2.4,6.2 L3.6,7" stroke="var(--color-ink-300)" strokeWidth={0.6} strokeLinecap="round" />

      {/* Torso, hi-vis stripe, harness and carabiner */}
      <path d="M-13.5,-4 L-11,3.5" stroke="var(--color-safety-500)" strokeWidth={5} strokeLinecap="round" />
      <path d="M-13.1,-2.2 L-11.7,0.8" stroke="var(--color-bark-100)" strokeWidth={1.1} strokeLinecap="round" opacity={0.9} />
      <path d="M-14,-3 L-10.6,2.6" stroke="var(--color-safety-600)" strokeWidth={1.4} strokeLinecap="round" />
      <path d="M-12.6,3.7 L-9.6,4.3" stroke="var(--color-safety-600)" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={-11.2} cy={3.2} r={0.9} fill="var(--color-ink-300)" />

      {/* Head, helmet with brim, ear defender */}
      <ellipse cx={-12.3} cy={-6.3} rx={1.5} ry={1.4} fill="var(--color-bark-100)" />
      <circle cx={-14.8} cy={-8.6} r={3} fill="var(--color-safety-500)" />
      <path d="M-18,-9.3 L-11.4,-9.3" stroke="var(--color-safety-600)" strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={-12.6} cy={-7.9} r={1.35} fill="var(--color-forest-900)" />
      <path d="M-11.9,-8.9 L-11.9,-6.9" stroke="var(--color-forest-950)" strokeWidth={0.7} strokeLinecap="round" />
    </>
  );
}

/** Arms + chainsaw. Separate so the rAF loop can wobble it on its own pivot. */
function Chainsaw() {
  return (
    <>
      <path d="M-13.2,-3.2 L-9.4,-1.6" stroke="var(--color-safety-500)" strokeWidth={2.3} strokeLinecap="round" />
      <path d="M-12.8,-1.8 L-8.4,0.6" stroke="var(--color-safety-600)" strokeWidth={2} strokeLinecap="round" />
      <rect x={-8.6} y={-3.4} width={5.6} height={4.8} rx={1.2} fill="var(--color-forest-900)" />
      <rect x={-8.6} y={-1.5} width={5.6} height={1.2} fill="var(--color-ink-700)" />
      {/* Front handle / safety bar */}
      <path d="M-8.2,-3.6 C-7,-5.4 -4.6,-5.4 -3.4,-3.8" stroke="var(--color-safety-600)" strokeWidth={1.1} strokeLinecap="round" fill="none" />
      {/* Guide bar, with the chain teeth dashed over it */}
      <path d="M-3.2,-1.1 L2,-1.1" stroke="var(--color-ink-300)" strokeWidth={1.9} strokeLinecap="round" />
      <path d="M-3.2,-1.1 L2,-1.1" stroke="var(--color-bark-900)" strokeWidth={2.5} strokeDasharray="0.6 1" opacity={0.75} />
      <circle cx={-8.6} cy={-1.4} r={1.1} fill="var(--color-forest-950)" />
      <circle cx={-7.4} cy={0.9} r={1} fill="var(--color-forest-950)" />
    </>
  );
}

function StaticTree() {
  return (
    <g>
      <path d={TRUNK_PATH} fill="var(--color-bark-700)" />
      {BRANCHES.map((config) => (
        <g key={config.id}>
          <BranchArt config={config} />
        </g>
      ))}
      <g transform={`translate(${TRUNK_X - 5} ${BRANCHES[0].y + 2}) scale(${CLIMBER_SCALE})`}>
        <Climber />
        <Chainsaw />
      </g>
    </g>
  );
}

export default function ScrollTree() {
  const shouldReduceMotion = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 1280px)');
  const { scrollYProgress } = useScroll();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !isWide || shouldReduceMotion) return;

    const cache = new Map<string, SVGElement | null>();
    const el = (id: string) => {
      if (!cache.has(id)) cache.set(id, svg.querySelector<SVGElement>(`#${id}`));
      return cache.get(id) ?? null;
    };

    /** Timestamp of each cut, so impacts can decay on their own clock. */
    const cuts: Record<string, number | null> = {};
    let burst: { x: number; y: number; side: 'left' | 'right'; t0: number } | null = null;
    let raf = 0;

    /** Decaying oscillation: chainsaw bite, branch release, trunk landing. */
    const shock = (now: number, t0: number | null | undefined, amp: number, freq: number, decay: number) => {
      if (t0 == null) return 0;
      const dt = now - t0;
      if (dt < 0 || dt > 1.4) return 0;
      return amp * Math.exp(-dt * decay) * Math.sin(dt * freq);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now() / 1000;
      const p = clamp(scrollYProgress.get(), 0, 1);

      // ---- impacts currently ringing through the trunk ---------------------
      let kick = 0;
      for (const b of BRANCHES) kick += shock(now, cuts[b.id], 2.6, 34, 7);
      kick += shock(now, cuts.trunk, 4.4, 22, 5);

      // ---- who is being cut right now --------------------------------------
      let sawTargetY = BRANCHES[0].y;
      let bite = 0;
      for (const c of BRANCHES) {
        const t = inv(p, c.cutAt, c.cutAt + CUT_WINDOW);
        const near = inv(p, c.cutAt - 0.035, c.cutAt);
        if (t === 0 && near > bite) {
          bite = near;
          sawTargetY = c.y;
        }
      }
      const trunkBite = inv(p, TRUNK_CUT_AT - 0.04, TRUNK_CUT_AT + CUT_WINDOW * 0.2);
      const grindBite = inv(p, STUMP_GRIND_AT - 0.02, STUMP_GRIND_AT + CUT_WINDOW);
      const cuttingTrunk = p < TRUNK_CUT_AT + CUT_WINDOW * 0.25;
      const grinding = p > STUMP_GRIND_AT - 0.02 && p < STUMP_GRIND_AT + CUT_WINDOW;
      const sawing = Math.max(bite, cuttingTrunk ? trunkBite : 0, grinding ? grindBite : 0);

      // ---- sway of the standing tree, with every impact on top of it -------
      const standing = 1 - inv(p, TRUNK_CUT_AT, TRUNK_CUT_AT + CUT_WINDOW);
      const swayAmp = lerp(0.34, 0.72, 1 - inv(p, BRANCHES[0].cutAt, BRANCHES[4].cutAt));
      const sway = Math.sin(now * 1.05) * swayAmp * standing + kick;
      el('om-tree-sway')?.setAttribute('transform', `rotate(${sway.toFixed(3)} ${TRUNK_X} ${GROUND_Y})`);

      // ---- branches: shudder under the saw, then hinge and tumble ----------
      for (const c of BRANCHES) {
        const g = el(`om-${c.id}`);
        const t = inv(p, c.cutAt, c.cutAt + CUT_WINDOW);
        const tilt = c.side === 'right' ? 72 : -72;

        if (t === 0) {
          cuts[c.id] = null;
          const near = inv(p, c.cutAt - 0.035, c.cutAt);
          // Shakes where the chain bites, hardest right before it lets go.
          const shudder = Math.sin(now * 46) * 1.7 * near * near;
          const droop = -0.7 * near;
          if (g) {
            g.setAttribute('transform', `rotate(${(shudder + droop).toFixed(3)} ${c.x} ${c.y})`);
            g.setAttribute('opacity', '1');
          }
        } else {
          if (!cuts[c.id]) {
            cuts[c.id] = now;
            burst = { x: c.x, y: c.y, side: c.side, t0: now };
          }
          // Hangs on the last fibres, then gravity takes it.
          const rot = tilt * (0.22 * t + 0.68 * t * t + 0.8 * t * t * t);
          const y = 28 * t + 175 * t * t;
          if (g) {
            g.setAttribute('transform', `translate(0 ${y.toFixed(2)}) rotate(${rot.toFixed(2)} ${c.x} ${c.y})`);
            g.setAttribute('opacity', (1 - inv(t, 0.72, 1)).toFixed(3));
          }
        }

        el(`om-scar-${c.id}`)?.setAttribute('opacity', inv(t, 0, 0.1).toFixed(3));
      }

      // ---- chip burst at the moment of release ------------------------------
      const chips = el('om-chips');
      if (chips) {
        const dt = burst ? now - burst.t0 : 99;
        if (!burst || dt > 0.75) {
          chips.setAttribute('opacity', '0');
        } else {
          chips.setAttribute('opacity', '1');
          const dir = burst.side === 'right' ? 1 : -1;
          const kids = chips.children;
          for (let i = 0; i < kids.length; i += 1) {
            const a = -2.35 + (i % 5) * 0.32;
            const sp = 34 + (i % 4) * 11;
            const dx = Math.cos(a) * sp * dir * dt;
            const dy = Math.sin(a) * sp * dt + 105 * dt * dt;
            const chip = kids[i] as SVGElement;
            chip.setAttribute('cx', String(burst.x));
            chip.setAttribute('cy', String(burst.y));
            chip.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
            chip.setAttribute('opacity', (1 - dt / 0.75).toFixed(3));
          }
        }
      }

      // ---- sawdust falling out of the kerf ---------------------------------
      const dust = el('om-sawdust');
      if (dust) {
        dust.setAttribute('opacity', sawing > 0.25 ? '1' : '0');
        if (sawing > 0.25) {
          const baseY = grinding && grindBite > 0.2 ? GROUND_Y - 14 : cuttingTrunk && trunkBite > 0.2 ? GROUND_Y - 30 : sawTargetY;
          dust.setAttribute('transform', `translate(${TRUNK_X - 6} ${baseY.toFixed(1)})`);
          const kids = dust.children;
          for (let i = 0; i < kids.length; i += 1) {
            const ph = (now * 1.5 + i * 0.19) % 1;
            const speck = kids[i] as SVGElement;
            speck.setAttribute('transform', `translate(0 ${(ph * 24).toFixed(2)})`);
            speck.setAttribute('opacity', ((1 - ph) * 0.85 * sawing).toFixed(3));
          }
        }
      }

      // ---- trunk: leans back on the hinge, then comes down ------------------
      const tp = inv(p, TRUNK_CUT_AT, TRUNK_CUT_AT + CUT_WINDOW);
      if (tp > 0.55 && !cuts.trunk) cuts.trunk = now;
      if (tp === 0) cuts.trunk = null;
      const trunk = el('om-trunk');
      if (trunk) {
        const hinge = tp < 0.2 ? -2.4 * (tp / 0.2) : lerp(-2.4, 17, (tp - 0.2) / 0.8);
        const ty = 215 * Math.pow(Math.max(0, (tp - 0.2) / 0.8), 1.8);
        trunk.setAttribute('transform', `translate(0 ${ty.toFixed(2)}) rotate(${hinge.toFixed(2)} ${TRUNK_X} ${GROUND_Y})`);
        trunk.setAttribute('opacity', (1 - inv(tp, 0.82, 1)).toFixed(3));
      }

      // ---- stump, grinding, sprout -----------------------------------------
      const stump = el('om-stump');
      if (stump) {
        const s = lerp(1, 0.18, inv(p, STUMP_GRIND_AT, STUMP_GRIND_AT + CUT_WINDOW));
        const jitter = grinding && grindBite > 0.15 ? Math.sin(now * 52) * 0.5 : 0;
        const appear = inv(p, TRUNK_CUT_AT + 0.005, TRUNK_CUT_AT + 0.025);
        const gone = 1 - inv(p, STUMP_GRIND_AT + CUT_WINDOW * 0.85, STUMP_GRIND_AT + CUT_WINDOW);
        stump.setAttribute('opacity', (appear * gone).toFixed(3));
        stump.setAttribute(
          'transform',
          `translate(${(TRUNK_X * (1 - s) + jitter).toFixed(2)} ${(GROUND_Y * (1 - s)).toFixed(2)}) scale(${s.toFixed(3)})`
        );
      }

      const grind = el('om-grind');
      if (grind) {
        const g0 = inv(p, STUMP_GRIND_AT, STUMP_GRIND_AT + 0.015);
        const g1 = 1 - inv(p, STUMP_GRIND_AT + CUT_WINDOW * 0.6, STUMP_GRIND_AT + CUT_WINDOW);
        grind.setAttribute('opacity', (g0 * g1 * (0.55 + 0.45 * Math.sin(now * 14))).toFixed(3));
      }

      const sprout = el('om-sprout');
      if (sprout) {
        const s = inv(p, SPROUT_AT, 1);
        const e = 1 - Math.pow(1 - s, 3);
        sprout.setAttribute('opacity', inv(p, SPROUT_AT, SPROUT_AT + 0.015).toFixed(3));
        sprout.setAttribute(
          'transform',
          `translate(${(TRUNK_X * (1 - e)).toFixed(2)} ${(GROUND_Y * (1 - e)).toFixed(2)}) scale(${Math.max(0.001, e).toFixed(3)}) rotate(${(Math.sin(now * 1.3) * 2.4).toFixed(2)} ${TRUNK_X} ${GROUND_Y})`
        );
      }

      // ---- the pile of cut wood on the ground ------------------------------
      const pile = el('om-pile');
      if (pile) {
        // Hauled away just before the grinder arrives.
        pile.setAttribute('opacity', (1 - inv(p, STUMP_GRIND_AT - 0.04, STUMP_GRIND_AT)).toFixed(3));
        for (const c of BRANCHES) {
          const log = el(`om-log-${c.id}`);
          if (!log) continue;
          const a = inv(p, c.cutAt + CUT_WINDOW * 0.55, c.cutAt + CUT_WINDOW * 1.25);
          const settle = 1 - Math.pow(1 - a, 3);
          log.setAttribute('opacity', a > 0 ? '1' : '0');
          log.setAttribute('transform', `translate(0 ${(-46 * (1 - settle)).toFixed(2)})`);
        }
      }

      // ---- the climber: rides down, leans in, gets kicked by every cut ------
      const stops = [0, BRANCHES[0].cutAt, BRANCHES[1].cutAt, BRANCHES[2].cutAt, BRANCHES[3].cutAt, BRANCHES[4].cutAt, TRUNK_CUT_AT, STUMP_GRIND_AT];
      const vals = [
        BRANCHES[0].y + 2,
        BRANCHES[0].y + 2,
        BRANCHES[1].y + 2,
        BRANCHES[2].y + 2,
        BRANCHES[3].y + 2,
        BRANCHES[4].y + 2,
        GROUND_Y - 30,
        GROUND_Y - 14
      ];
      let cy = vals[vals.length - 1];
      for (let i = 0; i < stops.length - 1; i += 1) {
        if (p <= stops[i + 1]) {
          cy = lerp(vals[i], vals[i + 1], inv(p, stops[i], stops[i + 1]));
          break;
        }
      }

      const lean = sawing * 0.9 + kick * 0.35;
      const jolt = kick * 0.22;
      const climber = el('om-climber');
      if (climber) {
        climber.setAttribute(
          'transform',
          `translate(${(TRUNK_X - 5 + jolt).toFixed(2)} ${cy.toFixed(2)}) scale(${CLIMBER_SCALE}) rotate(${lean.toFixed(2)} 0 0)`
        );
        climber.setAttribute('opacity', (inv(p, 0, 0.015) * (1 - inv(p, SPROUT_AT - 0.02, SPROUT_AT))).toFixed(3));
      }

      const saw = el('om-saw');
      if (saw) {
        const wob = sawing > 0.1 ? Math.sin(now * 44) * 2.6 * sawing : 0;
        saw.setAttribute('transform', `rotate(${(wob + kick * 1.6).toFixed(2)} -8.6 -1.1)`);
      }

      const puff = el('om-puff');
      if (puff) {
        const ph = (now * 1.1) % 1;
        puff.setAttribute('opacity', (sawing > 0.15 ? (1 - ph) * 0.3 * sawing : 0).toFixed(3));
        puff.setAttribute('transform', `translate(${(-1.6 * ph).toFixed(2)} ${(-3.4 * ph).toFixed(2)}) scale(${(0.6 + ph * 0.8).toFixed(2)})`);
      }

      // ---- climbing line, anchored high on the trunk ------------------------
      const rope = el('om-rope');
      if (rope) {
        const hx = TRUNK_X - 5 - 11.2 * CLIMBER_SCALE + jolt;
        const hy = cy + 3.2 * CLIMBER_SCALE;
        rope.setAttribute(
          'd',
          `M${ANCHOR_X},${ANCHOR_Y} C${ANCHOR_X - 3},${((ANCHOR_Y + hy) / 2).toFixed(1)} ${(hx + 10).toFixed(1)},${(hy - 44).toFixed(1)} ${hx.toFixed(1)},${hy.toFixed(1)}`
        );
        rope.setAttribute('opacity', (0.85 * (1 - inv(p, SPROUT_AT - 0.02, SPROUT_AT))).toFixed(3));
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [isWide, shouldReduceMotion, scrollYProgress]);

  if (!isWide) return null;

  return (
    <div
      id="scroll-tree"
      aria-hidden="true"
      className="pointer-events-none fixed right-2 2xl:right-8 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      {/* Wider than strictly needed for the tree: at 124px the helmet and the
          chainsaw bar ran together into a smudge. */}
      <svg ref={svgRef} viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} className="h-[74vh] w-[152px] overflow-visible" fill="none" role="presentation">
        {/* Ground */}
        <line x1={20} y1={GROUND_Y} x2={100} y2={GROUND_Y} stroke="var(--color-forest-300)" strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />

        {shouldReduceMotion ? (
          <StaticTree />
        ) : (
          <>
            {/* Cut wood stacking up as the work goes on */}
            <g id="om-pile">
              {[
                { x: 24, y: 362, w: 20, h: 5, fill: 'var(--color-bark-700)', end: 'right' },
                { x: 74, y: 363, w: 19, h: 4.6, fill: 'var(--color-bark-800)', end: 'left' },
                { x: 30, y: 356, w: 17, h: 4.4, fill: 'var(--color-bark-600)', end: 'right' },
                { x: 76, y: 357, w: 15, h: 4.2, fill: 'var(--color-bark-700)', end: 'left' },
                { x: 36, y: 350, w: 13, h: 4, fill: 'var(--color-bark-800)', end: 'right' }
              ].map((log, index) => (
                <g key={BRANCHES[index].id} id={`om-log-${BRANCHES[index].id}`} opacity={0}>
                  <rect x={log.x} y={log.y} width={log.w} height={log.h} rx={log.h / 2} fill={log.fill} />
                  <ellipse
                    cx={log.end === 'right' ? log.x + log.w : log.x}
                    cy={log.y + log.h / 2}
                    rx={log.h / 3}
                    ry={log.h / 2}
                    fill="var(--color-bark-100)"
                  />
                </g>
              ))}
            </g>

            <g id="om-tree-sway">
              <g id="om-trunk">
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
                  <g key={config.id} id={`om-${config.id}`}>
                    <BranchArt config={config} />
                  </g>
                ))}

                {/* Pale cut faces left behind on the trunk */}
                {BRANCHES.map((config) => (
                  <ellipse key={config.id} id={`om-scar-${config.id}`} cx={config.x} cy={config.y} rx={2.8} ry={1.7} fill="var(--color-bark-100)" opacity={0} />
                ))}
              </g>
            </g>

            {/* Sawdust streaming out of the kerf, wherever he is working */}
            <g id="om-sawdust" opacity={0}>
              {[
                { cx: -1, cy: 0, r: 1.5, fill: 'var(--color-bark-600)' },
                { cx: 2, cy: 2, r: 1, fill: 'var(--color-bark-600)' },
                { cx: -4, cy: 1, r: 1.3, fill: 'var(--color-bark-700)' },
                { cx: 4, cy: 3, r: 0.9, fill: 'var(--color-bark-600)' },
                { cx: 0, cy: 4, r: 1.2, fill: 'var(--color-bark-700)' },
                { cx: -3, cy: 5, r: 0.8, fill: 'var(--color-bark-600)' }
              ].map((speck, index) => (
                <circle key={index} cx={speck.cx} cy={speck.cy} r={speck.r} fill={speck.fill} />
              ))}
            </g>

            {/* Chips thrown at the moment a branch lets go */}
            <g id="om-chips" opacity={0}>
              {[
                { r: 1.5, fill: 'var(--color-bark-100)' },
                { r: 1.2, fill: 'var(--color-bark-600)' },
                { r: 1.6, fill: 'var(--color-bark-50)' },
                { r: 1, fill: 'var(--color-bark-700)' },
                { r: 1.4, fill: 'var(--color-bark-100)' },
                { r: 1.1, fill: 'var(--color-bark-600)' },
                { r: 1.5, fill: 'var(--color-bark-50)' },
                { r: 0.9, fill: 'var(--color-bark-700)' },
                { r: 1.3, fill: 'var(--color-bark-100)' },
                { r: 1, fill: 'var(--color-bark-600)' }
              ].map((chip, index) => (
                <circle key={index} cx={0} cy={0} r={chip.r} fill={chip.fill} />
              ))}
            </g>

            {/* Climbing line: anchored in the crown, slack down to his harness */}
            <path
              id="om-rope"
              d={`M${ANCHOR_X},${ANCHOR_Y} C52,140 40,180 35,210`}
              stroke="var(--color-safety-400)"
              strokeWidth={0.9}
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
            />

            <g id="om-climber" transform={`translate(${TRUNK_X - 5} ${BRANCHES[0].y + 2}) scale(${CLIMBER_SCALE})`}>
              <Climber />
              <g id="om-saw">
                <Chainsaw />
                <circle id="om-puff" cx={-9.6} cy={-4.2} r={1.6} fill="var(--color-bark-100)" opacity={0} />
              </g>
            </g>

            {/* Stump with growth rings */}
            <g id="om-stump" opacity={0}>
              <path
                d={`M${TRUNK_X - 11},${GROUND_Y} C${TRUNK_X - 10},358 ${TRUNK_X - 9},348 ${TRUNK_X - 9},344 L${TRUNK_X + 9},344 C${TRUNK_X + 9},348 ${TRUNK_X + 10},358 ${TRUNK_X + 11},${GROUND_Y} Z`}
                fill="var(--color-bark-800)"
              />
              <ellipse cx={TRUNK_X} cy={344} rx={9} ry={3.4} fill="var(--color-bark-100)" />
              <ellipse cx={TRUNK_X} cy={344} rx={6} ry={2.2} fill="none" stroke="var(--color-bark-600)" strokeWidth={0.7} />
              <ellipse cx={TRUNK_X} cy={344} rx={3} ry={1.1} fill="none" stroke="var(--color-bark-600)" strokeWidth={0.7} />
            </g>

            {/* Grinder dust */}
            <g id="om-grind" opacity={0}>
              {[-14, -8, -2, 5, 11, 16].map((offset, index) => (
                <circle
                  key={offset}
                  cx={TRUNK_X + offset}
                  cy={GROUND_Y - 6 - (index % 3) * 4}
                  r={index % 2 === 0 ? 2 : 1.4}
                  fill="var(--color-bark-600)"
                />
              ))}
            </g>

            {/* New growth. Lighter greens than the rest of the tree: the sprout
                lands over the dark CTA and footer, where forest-500 disappears. */}
            <g id="om-sprout" opacity={0}>
              <path d={`M${TRUNK_X},${GROUND_Y} L${TRUNK_X},${GROUND_Y - 22}`} stroke="var(--color-forest-300)" strokeWidth={2.4} strokeLinecap="round" />
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
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
