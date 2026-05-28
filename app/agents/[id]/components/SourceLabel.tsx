// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SourceLabelProps {
  source: string;
  /** @deprecated — kept for call-site compat; all backgrounds are now dark */
  dark?: boolean;
}

export default function SourceLabel({ source }: SourceLabelProps) {
  return (
    <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>
      {source}
    </p>
  );
}
