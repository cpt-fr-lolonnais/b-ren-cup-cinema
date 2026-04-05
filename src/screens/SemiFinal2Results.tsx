import { useCallback, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTournamentStore, DEMO_SF2, RaceResult, TEAM_COLORS, computeTeamRankings, computeSfMatchups, computeMatchWinner } from '@/store/tournament';
import RaceResultInput from '@/components/RaceResultInput';
import NavButtons from '@/components/NavButtons';
import CountUp from '@/components/CountUp';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function SemiFinal2Results() {
  const teams = useTournamentStore(s => s.teams);
  const kidsQualification = useTournamentStore(s => s.kidsQualification);
  const adultsQualification = useTournamentStore(s => s.adultsQualification);
  const isPreview = useTournamentStore(s => s.isPreview);
  const sf2Results = useTournamentStore(s => s.sf2Results);
  const setSf2Results = useTournamentStore(s => s.setSf2Results);

  const rankings = useMemo(() => computeTeamRankings(teams, kidsQualification, adultsQualification), [teams, kidsQualification, adultsQualification]);
  const matchups = useMemo(() => computeSfMatchups(rankings), [rankings]);
  const [showResult, setShowResult] = useState(false);

  const teamA = matchups?.sf2[0].team;
  const teamB = matchups?.sf2[1].team;

  const participants = teamA && teamB ? [teamA.kid, teamA.adult, teamB.kid, teamB.adult] : [];

  const handleComplete = useCallback((results: RaceResult[]) => {
    setSf2Results(results);
  }, [setSf2Results]);

  useEffect(() => {
    if (sf2Results.length === 4) {
      setTimeout(() => setShowResult(true), 500);
    }
  }, [sf2Results]);

  const result = useMemo(
    () => (sf2Results.length === 4 && teamA && teamB) ? computeMatchWinner(sf2Results, teamA, teamB) : null,
    [sf2Results, teamA, teamB]
  );

  if (!matchups || !teamA || !teamB) {
    return (
      <div className="flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground font-body text-center">
          Bitte zuerst die vorherigen Ergebnisse eintragen.
        </p>
        <NavButtons hideNext />
      </div>
    );
  }

  const canAdvance = sf2Results.length === 4 && sf2Results.every(r => r.gpPoints > 0);

  return (
    <div className="flex flex-col items-center justify-start px-6 max-w-3xl mx-auto w-full h-full overflow-y-auto py-12">
      <SlideDown>
        <h1 className="text-2xl md:text-4xl font-display text-center mb-1 glow-accent">HALBFINAL 2</h1>
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
          previewResults={DEMO_SF2}
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
