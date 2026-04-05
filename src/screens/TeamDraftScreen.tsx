import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2 } from 'lucide-react';
import { useTournamentStore, ADULTS, DEMO_DRAFT, TEAM_COLORS } from '@/store/tournament';
import Avatar from '@/components/Avatar';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function TeamDraftScreen() {
  const kidsQualification = useTournamentStore(s => s.kidsQualification);
  const isPreview = useTournamentStore(s => s.isPreview);
  const teams = useTournamentStore(s => s.teams);
  const addTeam = useTournamentStore(s => s.addTeam);
  const draftStep = useTournamentStore(s => s.draftStep);
  const setDraftStep = useTournamentStore(s => s.setDraftStep);
  const undoLastTeam = useTournamentStore(s => s.undoLastTeam);

  const [showTeamReveal, setShowTeamReveal] = useState(false);
  const [animatingPair, setAnimatingPair] = useState(false);

  const kidsByRank = [...kidsQualification].sort((a, b) => b.rank - a.rank);
  const currentKid = kidsByRank[draftStep];
  const pickedAdults = teams.map(t => t.adult);
  const availableAdults = ADULTS.filter(a => !pickedAdults.includes(a));

  useEffect(() => {
    if (!isPreview || draftStep >= 4) return;
    const timer = setTimeout(() => {
      const demoPick = DEMO_DRAFT[draftStep];
      if (demoPick && !animatingPair) {
        const kid = kidsByRank[draftStep];
        if (kid) {
          setAnimatingPair(true);
          addTeam(kid.name, demoPick[1]);
          setTimeout(() => {
            setDraftStep(draftStep + 1);
            setAnimatingPair(false);
          }, 1200);
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, draftStep]);

  useEffect(() => {
    if (draftStep >= 4 && teams.length >= 4) {
      setTimeout(() => setShowTeamReveal(true), 800);
    }
  }, [draftStep, teams.length]);

  const handlePick = useCallback((adult: string) => {
    if (animatingPair || !currentKid) return;
    setAnimatingPair(true);
    addTeam(currentKid.name, adult);
    setTimeout(() => {
      setDraftStep(draftStep + 1);
      setAnimatingPair(false);
    }, 1200);
  }, [currentKid, draftStep, animatingPair, addTeam, setDraftStep]);

  if (showTeamReveal) {
    return (
      <div className="flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
        <SlideDown>
          <h1 className="text-3xl md:text-4xl font-display text-center mb-8 glow-accent">DIE TEAMS</h1>
        </SlideDown>
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          {teams.map((team, i) => {
            const color = TEAM_COLORS[team.colorIndex];
            return (
              <StaggerItem key={i} delay={0.2} index={i}>
                <div
                  className="glass-card p-5 flex flex-col items-center gap-3"
                  style={{ borderColor: color.hex, borderWidth: 2, boxShadow: `0 0 20px ${color.hex}30` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={team.kid} size={40} borderColor={color.hex} />
                    <span className="text-muted-foreground font-display text-lg">&</span>
                    <Avatar name={team.adult} size={40} borderColor={color.hex} index={4 + ADULTS.indexOf(team.adult as any)} />
                  </div>
                  <p className="font-body font-semibold text-foreground text-center">
                    {team.kid} & {team.adult}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </div>
        <NavButtons />
      </div>
    );
  }

  if (draftStep >= 4) return null;

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-2 glow-accent">TEAMWAHL</h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-8">
          Das schwächste Kind wählt zuerst seinen erwachsenen Partner.
        </p>
      </StaggerItem>

      <AnimatePresence mode="wait">
        {currentKid && (
          <motion.div
            key={currentKid.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" style={{ transform: 'scale(2)' }} />
              <Avatar name={currentKid.name} size={80} />
            </div>
            <p className="font-display text-lg text-foreground mt-4">{currentKid.name}</p>
            <p className="text-sm text-muted-foreground font-body">Rang {currentKid.rank} — wählt {currentKid.rank === 4 ? 'zuerst' : 'als nächstes'}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3 justify-center">
        {availableAdults.map(name => (
          <motion.button
            key={name}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePick(name)}
            disabled={animatingPair}
            className="glass-card px-5 py-3 flex items-center gap-3 hover:bg-primary/10 transition disabled:opacity-50"
          >
            <Avatar name={name} size={36} index={4 + ADULTS.indexOf(name as any)} />
            <span className="font-body font-semibold text-foreground">{name}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 flex gap-2">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all"
            style={{ background: i < draftStep ? '#e94560' : 'rgba(255,255,255,0.15)' }}
          />
        ))}
      </div>

      {draftStep > 0 && !animatingPair && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          onClick={() => undoLastTeam()}
          className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground font-body hover:text-foreground transition"
        >
          <Undo2 size={14} />
          Rückgängig
        </motion.button>
      )}

      <NavButtons hideNext />
    </div>
  );
}
