import { useTournamentStore, TEAM_COLORS } from '@/store/tournament';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function FinalsMatchupScreen() {
  const { sf1Results, sf2Results, getSfMatchups, getMatchWinner } = useTournamentStore();
  const matchups = getSfMatchups();

  if (!matchups) return null;

  const sf1Winner = sf1Results.length === 4 ? getMatchWinner(sf1Results, matchups.sf1[0].team, matchups.sf1[1].team) : null;
  const sf2Winner = sf2Results.length === 4 ? getMatchWinner(sf2Results, matchups.sf2[0].team, matchups.sf2[1].team) : null;

  if (!sf1Winner || !sf2Winner) return null;

  const finalist1 = sf1Winner.winner;
  const finalist2 = sf2Winner.winner;
  const loser1 = sf1Winner.loser;
  const loser2 = sf2Winner.loser;

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-2 glow-accent">DIE FINALS</h1>
      </SlideDown>

      <StaggerItem delay={0.4} className="w-full max-w-lg mb-6">
        <div className="glass-card p-6 text-center" style={{ borderColor: '#e94560', borderWidth: 2, boxShadow: '0 0 30px rgba(233,69,96,0.2)' }}>
          <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-widest">Final</p>
          <p className="font-display text-xl">
            <span style={{ color: TEAM_COLORS[finalist1.colorIndex].hex }}>{finalist1.kid} & {finalist1.adult}</span>
            <span className="text-muted-foreground mx-3">vs.</span>
            <span style={{ color: TEAM_COLORS[finalist2.colorIndex].hex }}>{finalist2.kid} & {finalist2.adult}</span>
          </p>
        </div>
      </StaggerItem>

      <StaggerItem delay={0.6} className="w-full max-w-lg">
        <div className="glass-card p-4 text-center opacity-60">
          <p className="text-xs text-muted-foreground font-body mb-1 uppercase tracking-widest">Kleiner Final — Spiel um Platz 3</p>
          <p className="font-body text-sm text-foreground">
            <span style={{ color: TEAM_COLORS[loser1.colorIndex].hex }}>{loser1.kid} & {loser1.adult}</span>
            <span className="text-muted-foreground mx-2">vs.</span>
            <span style={{ color: TEAM_COLORS[loser2.colorIndex].hex }}>{loser2.kid} & {loser2.adult}</span>
          </p>
        </div>
      </StaggerItem>

      <NavButtons />
    </div>
  );
}
