import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTournamentStore, TEAM_COLORS } from '@/store/tournament';
import CountUp from '@/components/CountUp';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function TeamRankingScreen() {
  const rankings = useTournamentStore(s => s.getTeamRankings());
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSorted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const displayRankings = sorted
    ? [...rankings].sort((a, b) => a.rank - b.rank)
    : rankings;

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-2 glow-accent">
          TEAM-RANGLISTE
        </h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-8">
          Kombination aus Kinder- und Erwachsenen-Qualifikation
        </p>
      </StaggerItem>

      <div className="w-full max-w-lg space-y-3">
        {displayRankings.map((tr, i) => {
          const color = TEAM_COLORS[tr.team.colorIndex];
          return (
            <motion.div
              key={`${tr.team.kid}-${tr.team.adult}`}
              layout
              transition={{ type: 'spring', duration: 0.6 }}
              className="glass-card p-4 flex items-center gap-4"
              style={{ borderColor: color.hex, borderWidth: 1, boxShadow: `0 0 12px ${color.hex}20` }}
            >
              {sorted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold"
                  style={{
                    background: tr.rank === 1 ? '#ffd166' : tr.rank === 2 ? '#c0c0c0' : tr.rank === 3 ? '#cd7f32' : '#555',
                    color: tr.rank <= 2 ? '#000' : '#fff',
                  }}
                >
                  {tr.rank}
                </motion.div>
              )}
              <div className="flex-1">
                <p className="font-body font-semibold text-foreground">
                  {tr.team.kid} & {tr.team.adult}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground font-body mt-1">
                  <span>Kind Rang <CountUp value={tr.kidRankPoints} /></span>
                  <span>+</span>
                  <span>Erwachsener Rang <CountUp value={tr.adultRankPoints} /></span>
                  <span>=</span>
                  <span className="text-foreground font-semibold">
                    <CountUp value={tr.totalRankPoints} /> Pkt.
                  </span>
                </div>
              </div>
              {sorted && tr.totalRankPoints === displayRankings.find(r => r.rank !== tr.rank && r.totalRankPoints === tr.totalRankPoints)?.totalRankPoints && (
                <div className="text-[10px] text-muted-foreground font-body">
                  GP: {tr.totalGpPoints}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <StaggerItem delay={1}>
        <p className="text-xs text-muted-foreground font-body text-center mt-6 max-w-md">
          Bei Gleichstand entscheidet die Summe der GP-Punkte als Tie-Breaker.
        </p>
      </StaggerItem>

      <NavButtons />
    </div>
  );
}
