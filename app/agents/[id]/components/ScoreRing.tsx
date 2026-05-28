'use client';

import { useEffect, useRef } from 'react';
import { LetterGrade } from '@/types/agent';
import { GRADE_HEX } from '@/lib/gradeAccent';

// Larger ring: r=54, stroke=14, viewBox 130×130, container 170×170
const RADIUS = 54;
const STROKE = 14;
const VB = 130;
const CX = VB / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  score: number;
  grade: LetterGrade;
}

export default function ScoreRing({ score, grade }: Props) {
  const mainRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const color = GRADE_HEX[grade];
  const targetOffset = CIRCUMFERENCE * (1 - score / 100);

  useEffect(() => {
    const main = mainRef.current;
    const glow = glowRef.current;
    if (!main || !glow) return;

    // Start fully empty
    main.style.strokeDashoffset = String(CIRCUMFERENCE);
    glow.style.strokeDashoffset = String(CIRCUMFERENCE);
    glow.style.opacity = '0';

    // Animate to target after two frames
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        main.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.1, 0.64, 1)';
        main.style.strokeDashoffset = String(targetOffset);

        // Glow follows slightly behind
        glow.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.1, 0.64, 1) 0.05s, opacity 0.3s ease';
        glow.style.strokeDashoffset = String(targetOffset);
        glow.style.opacity = '1';

        // After fill completes, start the pulse
        setTimeout(() => {
          if (glowRef.current) {
            glowRef.current.style.animation = 'ring-pulse 2.8s ease-in-out infinite';
          }
        }, 1500);
      });
    });
  }, [targetOffset]);

  return (
    <div className="relative shrink-0" style={{ width: 170, height: 170 }}>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="w-full h-full"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={CX} cy={CX} r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={STROKE}
        />
        {/* Glow layer — pulses after fill */}
        <circle
          ref={glowRef}
          cx={CX} cy={CX} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE + 4}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          opacity="0"
          style={{ filter: 'blur(6px)' }}
        />
        {/* Main ring */}
        <circle
          ref={mainRef}
          cx={CX} cy={CX} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white leading-none tracking-tight">{grade}</span>
        <span className="text-sm font-bold mt-1.5" style={{ color }}>{score}/100</span>
      </div>
    </div>
  );
}
