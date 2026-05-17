interface SourceLabelProps {
  source: string;
}

export default function SourceLabel({ source }: SourceLabelProps) {
  return <p className="text-xs text-gray-400 mt-0.5">{source}</p>;
}
