import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTournamentStore, DEMO_GRAND_FINAL, RaceResult, TEAM_COLORS } from '@/store/tournament';
import RaceResultInput from '@/components/RaceResultInput';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function GrandFinalResults() {
  const { isPreview, grandFinalResults, setGrandFinalResults, sf1Results, sf2Results, getSfMatchups, getMatchWinner } = useTournamentStore();
  const matchups = getSfMatchups();
  const [showResult, setShowResult] = useState(false);

  const sf1Winner = matchups && sf1Results.length === 4 ? getMatchWinner(sf1Results, matchups.sf1[0].team, matchups.sf1[1].team) : null;
  const sf2Winner = matchups && sf2Results.length === 4 ? getMatchWinner(sf2Results, matchups.sf2[0].team, matchups.sf2[1].team) : null;

  const teamA = sf1Winner?.winner;
  const teamB = sf2Winner?.winner;

  const participants = teamA && teamB ? [teamA.kid, teamA.adult, teamB.kid, teamB.adult] : [];

  const handleComplete = useCallback((results: RaceResult[]) => {
    setGrandFinalResults(results);
  }, [setGrandFinalResults]);

  useEffect(() => {
    if (grandFinalResults.length === 4) {
      setTimeout(() => setShowResult(true), 800);
    }
  }, [grandFinalResults]);

  if (!teamA || !teamB) return null;

  const result = grandFinalResults.length === 4 ? getMatchWinner(grandFinalResults, teamA, teamB) : null;
  const canAdvance = grandFinalResults.length === 4 && grandFinalResults.every(r => r.gpPoints > 0);

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-1 glow-accent">DAS FINALE</h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="font-body text-center mb-6 text-lg">
          <span style={{ color: TEAM_COLORS[teamA.colorIndex].hex }}>{teamA.kid} & {teamA.adult}</span>
          <span className="text-muted-foreground mx-3">vs.</span>
          <span style={{ color: TEAM_COLORS[teamB.colorIndex].hex }}>{teamB.kid} & {teamB.adult}</span>
        </p>
      </StaggerItem>

      <StaggerItem delay={0.3}>
        <RaceResultInput
          participants={participants}
          onComplete={handleComplete}
          isPreview={isPreview}
          previewResults={DEMO_GRAND_FINAL}
          showTeamColors
        />
      </StaggerItem>

      {showResult && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mt-6 glass-card p-6 text-center"
          style={{ borderColor: TEAM_COLORS[result.winner.colorIndex].hex, borderWidth: 2 }}
        >
          <p className="font-display text-2xl glow-gold" style={{ color: TEAM_COLORS[result.winner.colorIndex].hex }}>
            🏆 {result.winner.kid} & {result.winner.adult}
          </p>
          <p className="text-sm text-muted-foreground font-body mt-1">Finalsieger!</p>
        </motion.div>
      )}

      <NavButtons canAdvance={canAdvance} nextLabel="Sieger enthüllen" />
    </div>
  );
}
