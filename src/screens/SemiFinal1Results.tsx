import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTournamentStore, DEMO_SF1, RaceResult, TEAM_COLORS } from '@/store/tournament';
import RaceResultInput from '@/components/RaceResultInput';
import NavButtons from '@/components/NavButtons';
import CountUp from '@/components/CountUp';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function SemiFinal1Results() {
  const { isPreview, sf1Results, setSf1Results, getSfMatchups, getMatchWinner } = useTournamentStore();
  const matchups = getSfMatchups();
  const [showResult, setShowResult] = useState(false);

  if (!matchups) return null;
  const { sf1 } = matchups;
  const teamA = sf1[0].team;
  const teamB = sf1[1].team;

  const participants = [teamA.kid, teamA.adult, teamB.kid, teamB.adult];

  const handleComplete = useCallback((results: RaceResult[]) => {
    setSf1Results(results);
  }, [setSf1Results]);

  useEffect(() => {
    if (sf1Results.length === 4) {
      setTimeout(() => setShowResult(true), 500);
    }
  }, [sf1Results]);

  const result = sf1Results.length === 4 ? getMatchWinner(sf1Results, teamA, teamB) : null;
  const canAdvance = sf1Results.length === 4 && sf1Results.every(r => r.gpPoints > 0);

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-2xl md:text-4xl font-display text-center mb-1 glow-accent">HALBFINAL 1</h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="font-body text-center mb-6">
          <span style={{ color: TEAM_COLORS[teamA.colorIndex].hex }}>{teamA.kid} & {teamA.adult}</span>
          <span className="text-muted-foreground mx-2">vs.</span>
          <span style={{ color: TEAM_COLORS[teamB.colorIndex].hex }}>{teamB.kid} & {teamB.adult}</span>
        </p>
      </StaggerItem>

      <StaggerItem delay={0.3}>
        <RaceResultInput
          participants={participants}
          onComplete={handleComplete}
          isPreview={isPreview}
          previewResults={DEMO_SF1}
          showTeamColors
        />
      </StaggerItem>

      {showResult && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-card p-4 text-center"
        >
          <p className="text-sm text-muted-foreground font-body mb-2">
            {teamA.kid} & {teamA.adult}: <CountUp value={result.teamAPoints} /> Rangpunkte
            {result.tiebreak && <span className="ml-2">(GP: {result.teamAGp})</span>}
          </p>
          <p className="text-sm text-muted-foreground font-body mb-3">
            {teamB.kid} & {teamB.adult}: <CountUp value={result.teamBPoints} /> Rangpunkte
            {result.tiebreak && <span className="ml-2">(GP: {result.teamBGp})</span>}
          </p>
          <p className="font-display text-lg" style={{ color: TEAM_COLORS[result.winner.colorIndex].hex }}>
            Sieger: {result.winner.kid} & {result.winner.adult}
          </p>
        </motion.div>
      )}

      <NavButtons canAdvance={canAdvance} />
    </div>
  );
}
