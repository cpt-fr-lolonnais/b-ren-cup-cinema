import { useTournamentStore, KIDS } from '@/store/tournament';
import Avatar from '@/components/Avatar';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function KidsQualIntro() {
  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-3xl md:text-5xl font-display text-center mb-2 glow-accent">
          KINDER-QUALIFIKATION
        </h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-10">
          Die 4 Kinder fahren einen Grand Prix gegeneinander.
        </p>
      </StaggerItem>

      {/* Starting grid */}
      <div className="flex items-end gap-6 mb-10">
        {KIDS.map((name, i) => (
          <StaggerItem key={name} delay={0.4} index={i} className="flex flex-col items-center gap-2">
            <div style={{ marginBottom: i % 2 === 0 ? 0 : 16 }}>
              <Avatar name={name} size={56} index={i} />
            </div>
            <span className="font-body text-sm text-foreground">{name}</span>
            {/* Speed lines */}
            <div className="flex gap-0.5 opacity-30">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-0.5 rounded-full bg-primary" style={{ width: 12 + j * 8 }} />
              ))}
            </div>
          </StaggerItem>
        ))}
      </div>

      <StaggerItem delay={0.8}>
        <div className="glass-card p-4 text-sm text-muted-foreground font-body text-center max-w-md">
          Entscheidend ist nur die Reihenfolge unter den 4 Kindern — nicht die absolute Platzierung im Rennen.
        </div>
      </StaggerItem>

      <NavButtons />
    </div>
  );
}
