'use client';
import { useState } from 'react';

interface StatRow {
  label: string;
  value: string;
  color: string;
}

export interface AgentFlipCardFront {
  name: string;
  brokerage: string;
  avatarUrl: string;
  avatarBorder: string;
  stars: number;
  reviewCount: string;
  title: string;
}

export interface AgentFlipCardBack {
  grade: string;
  score: number;
  gradeColor: string;
  borderColor: string;
  glowColor: string;
  outcomeBg: string;
  stats: StatRow[];
  outcomeText: string;
  outcomeColor: string;
}

interface Props {
  frontData: AgentFlipCardFront;
  backData: AgentFlipCardBack;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function AgentFlipCard({ frontData, backData, isFlipped, onFlip }: Props) {
  return (
    <div
      onClick={onFlip}
      style={{
        width: '100%',
        maxWidth: '300px',
        minHeight: '420px',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '20px',
        border: `2px solid ${isFlipped ? backData.borderColor : '#2D3148'}`,
        background: isFlipped ? backData.outcomeBg : '#0F1117',
        transition: 'border-color 0.4s ease, background 0.4s ease',
        boxShadow: isFlipped
          ? `0 8px 40px ${backData.glowColor}`
          : '0 8px 32px rgba(0,0,0,0.4)',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* ── FRONT FACE ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          opacity: isFlipped ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: isFlipped ? 'none' : 'auto',
          borderRadius: '20px',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={frontData.avatarUrl}
          alt={frontData.name}
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center top',
            border: `3px solid ${frontData.avatarBorder}`,
            marginBottom: '12px',
            display: 'block',
            flexShrink: 0,
          }}
        />

        <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px', textAlign: 'center' }}>
          {frontData.name}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: frontData.avatarBorder, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          {frontData.title}
        </div>
        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', textAlign: 'center' }}>
          {frontData.brokerage}
        </div>

        <div style={{ width: '100%', height: '1px', background: '#2D3148', marginBottom: '16px' }} />

        <div style={{ fontSize: '20px', color: '#F59E0B', marginBottom: '6px', letterSpacing: '2px' }}>
          {'★'.repeat(frontData.stars)}
        </div>
        <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
          {frontData.reviewCount}
        </div>

        {/* Blurred data rows */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: '32px', background: '#1E2330', borderRadius: '8px', filter: 'blur(3px)', opacity: 0.7 }} />
          ))}
        </div>

        <div style={{ fontSize: '12px', color: '#4B5563', fontStyle: 'italic', textAlign: 'center', marginBottom: '8px' }}>
          Tap to reveal · Tap again to compare
        </div>
        <div style={{ fontSize: '18px', opacity: 0.4 }}>🔒</div>
      </div>

      {/* ── BACK FACE ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: isFlipped ? 1 : 0,
          transition: 'opacity 0.3s ease 0.1s',
          pointerEvents: isFlipped ? 'auto' : 'none',
          borderRadius: '20px',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
          {frontData.name}
        </div>
        <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '16px' }}>
          {frontData.brokerage}
        </div>

        {/* Score ring */}
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          border: `4px solid ${backData.gradeColor}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: `0 0 20px ${backData.glowColor}`,
          background: '#0A0A0A',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: backData.gradeColor, lineHeight: 1 }}>
            {backData.grade}
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>{backData.score}/100</div>
        </div>

        {/* Stat rows */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {backData.stats.map((stat, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '7px 0',
              borderBottom: '1px solid #1E2A3A',
            }}>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: stat.color, textAlign: 'right', maxWidth: '55%' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Outcome */}
        <div style={{
          width: '100%',
          background: backData.outcomeBg,
          border: `1px solid ${backData.borderColor}`,
          borderRadius: '10px',
          padding: '10px 12px',
          marginTop: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: backData.outcomeColor, lineHeight: 1.4 }}>
            {backData.outcomeText}
          </div>
        </div>
      </div>
    </div>
  );
}
