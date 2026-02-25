type Props = {
  label: string;
  value: string | number;
  color?: string;
  barPercent?: number;
  subtext?: string;
  icon?: string;
};

export default function StatCard({ label, value, color = '#00FF88', barPercent, subtext, icon }: Props) {
  return (
    <div className="bg-[#0D1215] border border-[#1E2529] p-4 rounded-2xl hover:border-[#2A2A2A] transition-colors group">
      <div className="text-xs text-[#A0AEC0] font-bold uppercase tracking-wider mb-2">{icon && <span className="mr-1">{icon}</span>}{label}</div>
      <div
        className="text-2xl font-bold mb-1"
        style={{ color, textShadow: `0 0 8px ${color}66` }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {subtext && <div className="text-[10px] text-[#B8C5D0]">{subtext}</div>}
      {barPercent !== undefined && (
        <div className="mt-3 w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, barPercent)}%`,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}99`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
