import { useTournamentStore, ADULTS, TEAM_COLORS } from '@/store/tournament';
import Avatar from '@/components/Avatar';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function AdultsQualIntro() {
  const teams = useTournamentStore(s => s.teams);

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-2 glow-accent">
          ERWACHSENEN-QUALIFIKATION
        </h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-10">
          Die 4 Erwachsenen fahren einen Grand Prix gegeneinander.
        </p>
      </StaggerItem>

      <div className="flex items-end gap-6 mb-10">
        {ADULTS.map((name, i) => {
          const team = teams.find(t => t.adult === name);
          const teamColor = team ? TEAM_COLORS[team.colorIndex].hex : undefined;
          return (
            <StaggerItem key={name} delay={0.4} index={i} className="flex flex-col items-center gap-2">
              <div style={{ marginBottom: i % 2 === 0 ? 0 : 16 }}>
                <Avatar name={name} size={56} index={i + 4} borderColor={teamColor} />
              </div>
              <span className="font-body text-sm text-foreground">{name}</span>
            </StaggerItem>
          );
        })}
      </div>

      <StaggerItem delay={0.8}>
        <div className="glass-card p-4 text-sm text-muted-foreground font-body text-center max-w-md">
          Auch hier zählt nur die interne Reihenfolge unter den 4 Erwachsenen.
        </div>
      </StaggerItem>

      <NavButtons />
    </div>
  );
}
