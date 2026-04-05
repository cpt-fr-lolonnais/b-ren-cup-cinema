import { useMemo } from 'react';
import { useTournamentStore, TEAM_COLORS, computeTeamRankings, computeSfMatchups } from '@/store/tournament';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function SemiFinalsBracket() {
  const teams = useTournamentStore(s => s.teams);
  const kidsQualification = useTournamentStore(s => s.kidsQualification);
  const adultsQualification = useTournamentStore(s => s.adultsQualification);

  const rankings = useMemo(
    () => computeTeamRankings(teams, kidsQualification, adultsQualification),
    [teams, kidsQualification, adultsQualification]
  );
  const matchups = useMemo(() => computeSfMatchups(rankings), [rankings]);

  if (!matchups) return null;
  const { sf1, sf2 } = matchups;

  const teamLabel = (tr: typeof sf1[0]) => `${tr.team.kid} & ${tr.team.adult}`;
  const teamColor = (tr: typeof sf1[0]) => TEAM_COLORS[tr.team.colorIndex].hex;

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-2 glow-accent">HALBFINALS</h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-8">
          Turnierklammer
        </p>
      </StaggerItem>

      <StaggerItem delay={0.3} className="w-full max-w-2xl">
        <div className="grid grid-cols-5 gap-2 items-center">
          <div className="col-span-1 space-y-2">
            <div className="glass-card p-3 text-sm font-body text-foreground" style={{ borderColor: teamColor(sf1[0]), borderWidth: 1 }}>
              <span className="text-xs text-muted-foreground">Rang 1</span><br/>
              {teamLabel(sf1[0])}
            </div>
            <div className="glass-card p-3 text-sm font-body text-foreground" style={{ borderColor: teamColor(sf1[1]), borderWidth: 1 }}>
              <span className="text-xs text-muted-foreground">Rang 4</span><br/>
              {teamLabel(sf1[1])}
            </div>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="w-full h-px bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground font-body my-1">HF1</span>
            <div className="w-full h-px bg-muted-foreground/30" />
          </div>

          <div className="col-span-1 flex items-center justify-center">
            <div className="glass-card p-4 text-center animate-pulse-glow" style={{ borderColor: '#e94560', borderWidth: 1 }}>
              <span className="font-display text-sm text-primary">FINAL</span>
            </div>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="w-full h-px bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground font-body my-1">HF2</span>
            <div className="w-full h-px bg-muted-foreground/30" />
          </div>

          <div className="col-span-1 space-y-2">
            <div className="glass-card p-3 text-sm font-body text-foreground" style={{ borderColor: teamColor(sf2[0]), borderWidth: 1 }}>
              <span className="text-xs text-muted-foreground">Rang 2</span><br/>
              {teamLabel(sf2[0])}
            </div>
            <div className="glass-card p-3 text-sm font-body text-foreground" style={{ borderColor: teamColor(sf2[1]), borderWidth: 1 }}>
              <span className="text-xs text-muted-foreground">Rang 3</span><br/>
              {teamLabel(sf2[1])}
            </div>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem delay={0.6}>
        <p className="text-sm text-muted-foreground font-body text-center mt-6 max-w-md">
          Beide Teammitglieder fahren gleichzeitig — Teamtaktik ist möglich!
        </p>
      </StaggerItem>

      <StaggerItem delay={0.7}>
        <p className="text-xs text-muted-foreground/60 font-body text-center mt-2">
          (Verlierer beider Halbfinals spielen den kleinen Final)
        </p>
      </StaggerItem>

      <NavButtons />
    </div>
  );
}
