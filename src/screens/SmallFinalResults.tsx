import { useCallback, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTournamentStore, DEMO_SMALL_FINAL, RaceResult, TEAM_COLORS, computeTeamRankings, computeSfMatchups, computeMatchWinner } from '@/store/tournament';
import RaceResultInput from '@/components/RaceResultInput';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function SmallFinalResults() {
  const teams = useTournamentStore(s => s.teams);
  const kidsQualification = useTournamentStore(s => s.kidsQualification);
  const adultsQualification = useTournamentStore(s => s.adultsQualification);
  const isPreview = useTournamentStore(s => s.isPreview);
  const smallFinalResults = useTournamentStore(s => s.smallFinalResults);
  const setSmallFinalResults = useTournamentStore(s => s.setSmallFinalResults);
  const sf1Results = useTournamentStore(s => s.sf1Results);
  const sf2Results = useTournamentStore(s => s.sf2Results);

  const rankings = useMemo(() => computeTeamRankings(teams, kidsQualification, adultsQualification), [teams, kidsQualification, adultsQualification]);
  const matchups = useMemo(() => computeSfMatchups(rankings), [rankings]);
  const [showResult, setShowResult] = useState(false);

  const sf1Winner = useMemo(
    () => matchups && sf1Results.length === 4 ? computeMatchWinner(sf1Results, matchups.sf1[0].team, matchups.sf1[1].team) : null,
    [matchups, sf1Results]
  );
  const sf2Winner = useMemo(
    () => matchups && sf2Results.length === 4 ? computeMatchWinner(sf2Results, matchups.sf2[0].team, matchups.sf2[1].team) : null,
    [matchups, sf2Results]
  );

  const teamA = sf1Winner?.loser;
  const teamB = sf2Winner?.loser;

  const participants = teamA && teamB ? [teamA.kid, teamA.adult, teamB.kid, teamB.adult] : [];

  const handleComplete = useCallback((results: RaceResult[]) => {
    setSmallFinalResults(results);
  }, [setSmallFinalResults]);

  useEffect(() => {
    if (smallFinalResults.length === 4) {
      setTimeout(() => setShowResult(true), 500);
    }
  }, [smallFinalResults]);

  if (!teamA || !teamB) {
    return (
      <div className="flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground font-body text-center">
          Bitte zuerst die vorherigen Ergebnisse eintragen.
        </p>
        <NavButtons hideNext />
      </div>
    );
  }

  const result = smallFinalResults.length === 4 ? computeMatchWinner(smallFinalResults, teamA, teamB) : null;
  const canAdvance = smallFinalResults.length === 4 && smallFinalResults.every(r => r.gpPoints > 0);

  return (
    <div className="flex flex-col items-center justify-start px-6 max-w-3xl mx-auto w-full h-full overflow-y-auto py-12">
      <SlideDown>
        <h1 className="text-2xl md:text-4xl font-display text-center mb-1 glow-accent">KLEINER FINAL</h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-6">Spiel um Platz 3</p>
      </StaggerItem>

      <StaggerItem delay={0.3}>
        <p className="font-body text-center mb-4">
          <span style={{ color: TEAM_COLORS[teamA.colorIndex].hex }}>{teamA.kid} & {teamA.adult}</span>
          <span className="text-muted-foreground mx-2">vs.</span>
          <span style={{ color: TEAM_COLORS[teamB.colorIndex].hex }}>{teamB.kid} & {teamB.adult}</span>
        </p>
      </StaggerItem>

      <StaggerItem delay={0.4}>
        <RaceResultInput
          participants={participants}
          onComplete={handleComplete}
          isPreview={isPreview}
          previewResults={DEMO_SMALL_FINAL}
          showTeamColors
        />
      </StaggerItem>

      {showResult && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-card p-4 text-center"
        >
          <p className="font-display text-lg" style={{ color: TEAM_COLORS[result.winner.colorIndex].hex }}>
            Platz 3: {result.winner.kid} & {result.winner.adult}
          </p>
        </motion.div>
      )}

      <NavButtons canAdvance={canAdvance} />
    </div>
  );
}
