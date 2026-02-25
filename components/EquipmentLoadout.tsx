type Props = {
  equipment: Record<string, string | null> | null;
};

const SLOT_ICONS: Record<string, string> = {
  weapon: 'fa-solid fa-wand-magic-sparkles',
  chest: 'fa-solid fa-shirt',
  boots: 'fa-solid fa-shoe-prints',
  gloves: 'fa-solid fa-hand',
  head: 'fa-solid fa-helmet-safety',
  pants: 'fa-solid fa-vest-patches',
  cloak: 'fa-solid fa-wind',
  accessory: 'fa-solid fa-ring',
  skin: 'fa-solid fa-palette',
};

export default function EquipmentLoadout({ equipment }: Props) {
  if (!equipment) return null;

  const slots = Object.entries(equipment).filter(([, v]) => v);
  if (slots.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          <i className="fa-solid fa-shield-halved mr-2 text-[#3B82F6]"></i>
          Equipment Loadout
        </h2>
      </div>

      <div className="bg-[#0D1215] border border-[#1E2529] rounded-2xl p-5 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {slots.map(([slot, item]) => (
            <div
              key={slot}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1A1A]/40 border border-[#1E2529] hover:bg-[#1A1A1A] transition-colors relative overflow-hidden"
            >
              <div className="absolute inset-0 border-l-[3px] border-[#3B82F6] opacity-100"></div>
              <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 border border-[#3B82F6]/30">
                <i className={`${SLOT_ICONS[slot] || 'fa-solid fa-cube'} text-[#3B82F6]`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{item}</p>
                <p className="text-[10px] text-[#A0AEC0] uppercase tracking-wider">{slot}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
