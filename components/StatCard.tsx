export default function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}
