const MATERIAL_NAMES: Record<string, string> = {
  fds: 'Freedom Dust', vsa: 'Voidstone Ash', admt: 'Adamantite', aths: 'Athersteel',
  biog: 'Biogel', bstr: 'Blastite', crm: 'Chromium', drs: 'Darkite Shard',
  ncc: 'Necrocite', nrfm: 'Neuroform', obs: 'Obsidianite', pmf: 'Plasma Flux', qtpc: 'Quanticore',
};

const MATERIAL_ICONS: Record<string, string> = {
  fds: 'fa-solid fa-coins', vsa: 'fa-solid fa-fire', admt: 'fa-solid fa-gem',
  aths: 'fa-solid fa-bolt', biog: 'fa-solid fa-flask', bstr: 'fa-solid fa-bomb',
  crm: 'fa-solid fa-cog', drs: 'fa-solid fa-moon', ncc: 'fa-solid fa-skull',
  nrfm: 'fa-solid fa-brain', obs: 'fa-solid fa-diamond', pmf: 'fa-solid fa-atom',
  qtpc: 'fa-solid fa-microchip',
};

const MATERIAL_COLORS: Record<string, string> = {
  fds: '#FFD700', vsa: '#FF6B6B', admt: '#A78BFA', aths: '#3B82F6',
  biog: '#00FF88', bstr: '#FF6B6B', crm: '#B8C5D0', drs: '#9D4EDD',
  ncc: '#FF6B6B', nrfm: '#A78BFA', obs: '#1A1A1A', pmf: '#00FF88',
  qtpc: '#3B82F6',
};

type Props = {
  materials: Record<string, number> | null;
  nfts: number;
};

export default function MaterialsNFTs({ materials, nfts }: Props) {
  if (!materials && nfts === 0) return null;

  const items = materials
    ? Object.entries(materials).filter(([, v]) => Number(v) > 0)
    : [];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          <i className="fa-solid fa-gem mr-2 text-[#A78BFA]"></i>
          Materials & NFTs
        </h2>
      </div>

      <div className="bg-[#0D1215] border border-[#1E2529] rounded-2xl p-5 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map(([k, v]) => (
            <div
              key={k}
              className="bg-[#1A1A1A]/40 border border-[#1E2529] rounded-xl p-3 text-center hover:bg-[#1A1A1A] transition-colors relative group"
            >
              <div className="mb-2">
                <i className={`${MATERIAL_ICONS[k] || 'fa-solid fa-cube'} text-2xl`} style={{ color: MATERIAL_COLORS[k] || '#B8C5D0' }}></i>
              </div>
              <div className="text-lg font-bold" style={{ color: MATERIAL_COLORS[k] || '#B8C5D0' }}>
                {Number(v).toLocaleString()}
              </div>
              <div className="text-[10px] text-[#A0AEC0] uppercase tracking-wider mt-1">
                {MATERIAL_NAMES[k] || k.toUpperCase()}
              </div>
            </div>
          ))}
          {nfts > 0 && (
            <div className="bg-[#1A1A1A]/40 border border-[#FFD700] rounded-xl p-3 text-center hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all relative">
              <div className="absolute inset-0 bg-[#FFD700]/5 rounded-xl"></div>
              <div className="mb-2 relative">
                <i className="fa-solid fa-certificate text-2xl text-[#FFD700]"></i>
              </div>
              <div className="text-lg font-bold text-[#FFD700] relative">{nfts}</div>
              <div className="text-[10px] text-[#A0AEC0] uppercase tracking-wider mt-1 relative">NFTs Earned</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
