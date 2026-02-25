export default function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon?: string; color?: string }) {
  return (
    <div className="card-inner p-4 text-center" style={{ border: '1px solid #1E2529' }}>
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-2xl font-bold" style={{ color: color || '#FFFFFF' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm mt-1" style={{ color: '#7A8A99' }}>{label}</div>
    </div>
  );
}
