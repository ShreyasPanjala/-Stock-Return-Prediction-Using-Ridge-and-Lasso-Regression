interface SummaryCardProps {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}

export default function SummaryCard({ label, value, subtext, highlight }: SummaryCardProps) {
  return (
    <div className={`p-5 rounded-lg border ${highlight ? 'border-primary bg-primary/5' : 'border-border bg-card'} shadow-subtle`}>
      <div className="text-xs font-semibold text-neutral uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-bold mb-1 ${highlight ? 'text-primary' : 'text-navy'}`}>{value}</div>
      {subtext && <div className="text-sm text-neutral truncate">{subtext}</div>}
    </div>
  );
}
