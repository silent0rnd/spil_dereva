/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  // Dimensions based on size prop
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  if (!imgError) {
    return (
      <img
        // The site is served from a base path (/spil_dereva/), so a root-absolute
        // "/logo.png" 404s and silently falls through to the inline SVG below.
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="Логотип"
        className={`${dimensions} ${className} object-contain`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 110"
      className={`${dimensions} ${className}`}
      fill="none"
    >
      {/* Shield Outer Shadow */}
      <path
        d="M50,11 L86,24 L86,74 L50,104 L14,74 L14,24 Z"
        fill="#121e15"
        opacity="0.3"
      />

      {/* Shield Background (Dark Green) */}
      <path
        d="M50,8 L84,21 L84,71 L50,101 L16,71 L16,21 Z"
        fill="#1b3d27" /* Beautiful forest dark green matching user's logo */
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Arborist climber and tree trunk silhouette inside the shield */}
      <g>
        {/* Tree Trunk (White) */}
        <path
          d="M56,22 
             C58,35 56,50 55,65 
             C54,75 56,86 58,98 
             L75,94 
             C73,81 74,66 75,51 
             C76,41 77,31 76,22 
             Z"
          fill="#ffffff"
        />

        {/* Tree Trunk Texture Cutouts (Green slits inside white trunk) */}
        <path
          d="M61,27 C62,40 59,60 58,80"
          stroke="#1b3d27"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M69,24 C68,47 69,67 71,90"
          stroke="#1b3d27"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Arborist Climber (White) */}
        {/* Helmet */}
        <circle cx="39" cy="35" r="4.5" fill="#ffffff" />
        
        {/* Body, Torso and Climbing harness */}
        <path
          d="M39,40 
             C34,43 29,49 29,57 
             C29,61 31,65 34,66 
             C36,66 37,64 36,61 
             C35,54 38,49 42,47 
             Z"
          fill="#ffffff"
        />

        {/* Leg 1 (Upper horizontal leg bracing against tree trunk) */}
        <path
          d="M32,63 
             C35,63 44,61 48,60 
             C51,59 54,59 54,63 
             C54,65 51,65 47,66 
             C41,67 35,67 32,66 
             Z"
          fill="#ffffff"
        />

        {/* Leg 2 (Lower diagonal leg supporting the climber) */}
        <path
          d="M31,66 
             C32,70 36,76 42,79 
             C45,80 48,79 48,75 
             C48,73 45,72 42,70 
             C38,68 34,66 31,66 
             Z"
          fill="#ffffff"
        />

        {/* Safety Lanyard (Rope wrapped around the trunk for climbing support) */}
        <path
          d="M32,59 C42,57 48,51 54,55"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M75,57 C79,59 83,61 83,63"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Chainsaw cutting into the tree */}
        <path
          d="M41,46 L49,46 L49,53 L41,53 Z"
          fill="#ffffff"
        />
        <path
          d="M37,49 L41,49"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* Chainsaw Guide Bar / Cutter Blade */}
        <path
          d="M49,48 L62,48 L62,51 L49,51 Z"
          fill="#ffffff"
        />
        {/* The wedge cut notch made in tree */}
        <path
          d="M62,46 L65,49 L62,53 Z"
          fill="#1b3d27"
        />
      </g>
    </svg>
  );
}

