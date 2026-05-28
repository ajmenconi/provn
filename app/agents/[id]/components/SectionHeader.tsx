interface Props { children: React.ReactNode; className?: string; }

export default function SectionHeader({ children, className = 'mb-5' }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="shrink-0 rounded-full" style={{ width: '3px', height: '14px', backgroundColor: '#10B981' }} />
      <p
        className="uppercase"
        style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em' }}
      >
        {children}
      </p>
    </div>
  );
}
