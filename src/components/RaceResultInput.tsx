import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import { RaceResult, TEAM_COLORS, useTournamentStore } from '@/store/tournament';

const RANK_COLORS = ['#ffd166', '#c0c0c0', '#cd7f32', '#666'];
const RANK_LABELS = ['1.', '2.', '3.', '4.'];

interface Props {
  participants: string[];
  onComplete: (results: RaceResult[]) => void;
  isPreview: boolean;
  previewResults?: RaceResult[];
  showTeamColors?: boolean;
}

export default function RaceResultInput({ participants, onComplete, isPreview, previewResults, showTeamColors }: Props) {
  const [placed, setPlaced] = useState<RaceResult[]>([]);
  const [gpPoints, setGpPoints] = useState<Record<string, number>>({});
  const getTeamByMember = useTournamentStore(s => s.getTeamByMember);
  const getTeamColor = useTournamentStore(s => s.getTeamColor);

  useEffect(() => {
    if (isPreview && previewResults) {
      const pts: Record<string, number> = {};
      previewResults.forEach(r => { pts[r.name] = r.gpPoints; });
      setPlaced(previewResults);
      setGpPoints(pts);
    }
  }, [isPreview, previewResults]);

  const available = participants.filter(p => !placed.find(r => r.name === p));
  const allPlaced = placed.length === 4;
  const allGpFilled = allPlaced && placed.every(r => (gpPoints[r.name] ?? 0) > 0);

  const placeNext = useCallback((name: string) => {
    const rank = placed.length + 1;
    setPlaced(prev => [...prev, { name, rank, gpPoints: gpPoints[name] ?? 0 }]);
  }, [placed, gpPoints]);

  const updateGp = useCallback((name: string, val: number) => {
    setGpPoints(prev => ({ ...prev, [name]: val }));
  }, []);

  useEffect(() => {
    if (allGpFilled) {
      onComplete(placed.map(r => ({ ...r, gpPoints: gpPoints[r.name] ?? 0 })));
    }
  }, [allGpFilled, placed, gpPoints, onComplete]);

  const getTeamBorder = (name: string) => {
    if (!showTeamColors) return undefined;
    const team = getTeamByMember(name);
    if (!team) return undefined;
    return getTeamColor(team).hex;
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      {/* Rank slots */}
      <div className="space-y-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="glass-card p-3 flex items-center gap-3 min-h-[56px]">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold shrink-0"
              style={{ background: RANK_COLORS[i], color: i < 2 ? '#000' : '#fff' }}
            >
              {RANK_LABELS[i]}
            </div>
            <AnimatePresence>
              {placed[i] ? (
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex items-center gap-3 flex-1"
                >
                  <Avatar name={placed[i].name} size={32} borderColor={getTeamBorder(placed[i].name)} />
                  <span className="font-body font-semibold text-foreground flex-1">{placed[i].name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">GP:</span>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={gpPoints[placed[i].name] ?? ''}
                      onChange={e => updateGp(placed[i].name, parseInt(e.target.value) || 0)}
                      className="w-14 h-8 rounded-md bg-muted border border-border text-center text-sm text-foreground font-body"
                      disabled={isPreview}
                    />
                  </div>
                </motion.div>
              ) : (
                <span className="text-muted-foreground text-sm font-body">—</span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Available participants */}
      {!allPlaced && (
        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2 font-body">Klicke auf einen Namen:</p>
          <div className="flex flex-wrap gap-2">
            {available.map(name => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => placeNext(name)}
                className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-muted/30 transition"
              >
                <Avatar name={name} size={24} borderColor={getTeamBorder(name)} />
                <span className="font-body text-sm text-foreground">{name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
