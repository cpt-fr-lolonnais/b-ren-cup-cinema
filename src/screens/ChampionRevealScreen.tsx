import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTournamentStore, TEAM_COLORS, Team, computeTeamRankings, computeSfMatchups, computeMatchWinner } from '@/store/tournament';
import BearLogo from '@/components/BearLogo';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: number;
  speedX: number;
  speedY: number;
}

function useConfetti(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#e94560', '#4361ee', '#06d6a0', '#ffd166', '#ff6b9d', '#845ef7'];
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        id: i,
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: 4 + Math.random() * 8,
        speedX: (Math.random() - 0.5) * 3,
        speedY: 1.5 + Math.random() * 3,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += 2;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [active]);

  return canvasRef;
}

export default function ChampionRevealScreen() {
  const isPreview = useTournamentStore(s => s.isPreview);
  const teams = useTournamentStore(s => s.teams);
  const kidsQualification = useTournamentStore(s => s.kidsQualification);
  const adultsQualification = useTournamentStore(s => s.adultsQualification);
  const sf1Results = useTournamentStore(s => s.sf1Results);
  const sf2Results = useTournamentStore(s => s.sf2Results);
  const smallFinalResults = useTournamentStore(s => s.smallFinalResults);
  const grandFinalResults = useTournamentStore(s => s.grandFinalResults);

  const [phase, setPhase] = useState(0);

  const rankings = useMemo(() => computeTeamRankings(teams, kidsQualification, adultsQualification), [teams, kidsQualification, adultsQualification]);
  const matchups = useMemo(() => computeSfMatchups(rankings), [rankings]);

  const sf1Winner = useMemo(
    () => matchups && sf1Results.length === 4 ? computeMatchWinner(sf1Results, matchups.sf1[0].team, matchups.sf1[1].team) : null,
    [matchups, sf1Results]
  );
  const sf2Winner = useMemo(
    () => matchups && sf2Results.length === 4 ? computeMatchWinner(sf2Results, matchups.sf2[0].team, matchups.sf2[1].team) : null,
    [matchups, sf2Results]
  );
  const grandFinalResult = useMemo(
    () => sf1Winner && sf2Winner && grandFinalResults.length === 4
      ? computeMatchWinner(grandFinalResults, sf1Winner.winner, sf2Winner.winner) : null,
    [sf1Winner, sf2Winner, grandFinalResults]
  );
  const smallFinalResult = useMemo(
    () => sf1Winner && sf2Winner && smallFinalResults.length === 4
      ? computeMatchWinner(smallFinalResults, sf1Winner.loser, sf2Winner.loser) : null,
    [sf1Winner, sf2Winner, smallFinalResults]
  );

  const champion = grandFinalResult?.winner;
  const runnerUp = grandFinalResult?.loser;
  const third = smallFinalResult?.winner;
  const fourth = smallFinalResult?.loser;

  const confettiRef = useConfetti(!isPreview && phase >= 3);

  useEffect(() => {
    if (isPreview) return;
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isPreview]);

  if (isPreview) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-32 h-32 rounded-full mb-8"
          style={{ background: 'radial-gradient(circle, hsl(350 80% 59% / 0.4) 0%, transparent 70%)' }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="font-body text-xl text-muted-foreground tracking-widest"
          style={{ fontStyle: 'italic' }}
        >
          Wird am Turniertag enthüllt...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full overflow-hidden">
      <canvas ref={confettiRef} className="absolute inset-0 pointer-events-none z-50" />

      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 3], opacity: [1, 0] }}
            transition={{ duration: 1.2 }}
            className="absolute w-20 h-20 rounded-full border-2 border-primary"
          />
        )}
      </AnimatePresence>

      {phase >= 1 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <BearLogo size={80} glow />
        </motion.div>
      )}

      {phase >= 2 && (
        <motion.h1
          initial={{ opacity: 0, scale: 1.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          className="text-4xl md:text-6xl font-display glow-gold text-center mt-4"
          style={{ color: '#ffd166' }}
        >
          BÄREN CUP SIEGER
        </motion.h1>
      )}

      {phase >= 3 && champion && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          className="glass-card p-8 mt-6 text-center"
          style={{
            borderColor: TEAM_COLORS[champion.colorIndex].hex,
            borderWidth: 3,
            boxShadow: `0 0 40px ${TEAM_COLORS[champion.colorIndex].hex}40`,
          }}
        >
          <p className="text-3xl md:text-4xl font-display" style={{ color: TEAM_COLORS[champion.colorIndex].hex }}>
            {champion.kid} & {champion.adult}
          </p>
        </motion.div>
      )}

      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-2 text-center"
        >
          {[
            { emoji: '🏆', team: champion, label: '1.' },
            { emoji: '🥈', team: runnerUp, label: '2.' },
            { emoji: '🥉', team: third, label: '3.' },
            { emoji: '', team: fourth, label: '4.' },
          ].map(({ emoji, team, label }, i) => team && (
            <motion.p
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="font-body text-lg"
              style={{ color: i === 0 ? TEAM_COLORS[team.colorIndex].hex : i < 3 ? '#ccc' : '#888' }}
            >
              {emoji} {label} {team.kid} & {team.adult}
            </motion.p>
          ))}
        </motion.div>
      )}
    </div>
  );
}
