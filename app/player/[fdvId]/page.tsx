import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ShareButton from '@/components/ShareButton';
import AvatarImage from '@/components/AvatarImage';
import StatCard from '@/components/StatCard';
import { getPlayerInfo, getPlayerScapeSummary, getPlayerMaterials, getPlayerEquipment, getPlayerMatchHistory, getPlayerPlanetSummary, getPlayerCombatStats, getTotalNFTs } from '@/lib/queries/player';

export const revalidate = 600;

const MATERIAL_NAMES: Record<string, string> = {
  fds: 'Freedom Dust', vsa: 'Voidstone Ash', admt: 'Adamantite', aths: 'Athersteel',
  biog: 'Biogel', bstr: 'Blastite', crm: 'Chromium', drs: 'Darkite Shard',
  ncc: 'Necrocite', nrfm: 'Neuroform', obs: 'Obsidianite', pmf: 'Plasma Flux', qtpc: 'Quanticore',
};

type Props = { params: Promise<{ fdvId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fdvId } = await params;
  const player = await getPlayerInfo(Number(fdvId));
  if (!player) return { title: 'Player Not Found' };
  const summary = await getPlayerScapeSummary(Number(fdvId));
  const name = player.avatar_name || `#FDW${fdvId}`;
  return {
    title: `${name} — Level ${summary?.max_level || '?'} | Freedom Player Hub`,
    description: `${summary?.wins || 0}W / ${summary?.losses || 0}L · ${summary?.total_kills || 0} monsters slain · Win rate ${summary?.win_rate || 0}%`,
    openGraph: { title: `${name} — Freedom Player Hub`, description: `${summary?.wins || 0} wins · ${summary?.total_kills || 0} kills` },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { fdvId } = await params;
  const id = Number(fdvId);
  const player = await getPlayerInfo(id);
  if (!player) notFound();

  const [summary, materials, equipment, history, planets, combat, nfts] = await Promise.all([
    getPlayerScapeSummary(id), getPlayerMaterials(id), getPlayerEquipment(id),
    getPlayerMatchHistory(id), getPlayerPlanetSummary(id), getPlayerCombatStats(id), getTotalNFTs(id),
  ]);

  const name = player.avatar_name || `#FDW${fdvId}`;
  const s = summary as Record<string, number> | null;
  const winPct = s ? (s.total_matches > 0 ? ((s.wins / s.total_matches) * 100) : 0) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <section className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col sm:flex-row items-center gap-6">
        <AvatarImage fdvId={id} name={name} size={96} />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-purple-400 text-lg">Level {s?.max_level || '?'} · {Number(s?.max_total_xp || 0).toLocaleString()} XP</p>
          {s?.first_match && <p className="text-gray-500 text-sm mt-1">Member since {new Date(s.first_match).toLocaleDateString()}</p>}
        </div>
        <ShareButton />
      </section>

      {/* Combat Record */}
      {s && s.total_matches > 0 && (
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">⚔️ Combat Record</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard label="Wins" value={s.wins} icon="🟢" />
            <StatCard label="Losses" value={s.losses} icon="🔴" />
            <StatCard label="Abandons" value={s.abandons} icon="🟡" />
            <StatCard label="Win Rate" value={`${s.win_rate}%`} icon="🎯" />
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: `${winPct}%` }} />
          </div>
          <p className="text-gray-500 text-sm mt-2">{s.total_matches.toLocaleString()} total matches</p>
        </section>
      )}

      {/* Monster Stats + Combat Stats */}
      {s && s.total_kills > 0 && (
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">👹 Monster Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Monsters Killed" value={s.total_kills} icon="💀" />
            <StatCard label="Max Damage" value={(combat as Record<string, number>)?.max_damage || 0} icon="⚡" />
            <StatCard label="Max Block" value={(combat as Record<string, number>)?.max_block || 0} icon="🛡️" />
            <StatCard label="Max Heal" value={(combat as Record<string, number>)?.max_heal || 0} icon="💚" />
          </div>
        </section>
      )}

      {/* Equipment */}
      {equipment && (
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">🎒 Equipment Loadout</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(equipment).filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-xs uppercase">{k}</div>
                <div className="text-sm text-white truncate">{v}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Materials */}
      {materials && (
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">💎 Materials & NFTs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(materials as Record<string, number>)
              .filter(([, v]) => Number(v) > 0)
              .map(([k, v]) => (
                <div key={k} className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-400">{Number(v).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{MATERIAL_NAMES[k] || k.toUpperCase()}</div>
                </div>
              ))}
            {nfts > 0 && (
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-yellow-400">{nfts}</div>
                <div className="text-xs text-gray-400">NFTs</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Match History */}
      {history && (history as Array<Record<string, unknown>>).length > 0 && (
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">📜 Recent Matches</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-gray-400 border-b border-gray-800">
                <th className="py-2 px-2">Date</th><th className="py-2 px-2">Result</th>
                <th className="py-2 px-2 text-right">Kills</th><th className="py-2 px-2 text-right">XP</th>
                <th className="py-2 px-2 text-right">Level</th>
              </tr></thead>
              <tbody>
                {(history as Array<Record<string, unknown>>).map((m, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="py-2 px-2 text-gray-400">{m.timestamp ? new Date(m.timestamp as string).toLocaleDateString() : '-'}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${m.match_result === 'Win' ? 'bg-green-900 text-green-300' : m.match_result === 'Lose' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {m.match_result as string}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">{Number(m.monsters_killed)}</td>
                    <td className="py-2 px-2 text-right text-purple-400">{Number(m.xp_earned).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right">{Number(m.level)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Planet Stats */}
      {planets && Number((planets as Record<string, number>).total_planets) > 0 && (
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">🪐 Planet Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Planets" value={Number((planets as Record<string, number>).total_planets)} icon="🌍" />
            <StatCard label="Structures" value={Number((planets as Record<string, number>).total_structures)} icon="🏗️" />
            <StatCard label="FDS Earned" value={Number((planets as Record<string, number>).total_fds_earned).toFixed(2)} icon="💰" />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="text-center py-8">
        <p className="text-gray-400 mb-4">Want stats like these?</p>
        <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-lg font-bold transition-colors">
          Join Freedom World
        </a>
      </section>
    </div>
  );
}
