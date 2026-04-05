import { KIDS, ADULTS } from '@/store/tournament';
import Avatar from '@/components/Avatar';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function ParticipantsScreen() {
  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-4xl md:text-5xl font-display text-center mb-2 glow-accent">
          DIE TEILNEHMER
        </h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-10">
          4 Kinder und 4 Erwachsene treten an
        </p>
      </StaggerItem>

      <div className="flex flex-col md:flex-row gap-8 w-full items-start justify-center">
        {/* Kids */}
        <div className="flex-1 max-w-sm">
          <StaggerItem delay={0.3}>
            <h2 className="text-lg font-display text-center mb-4 text-primary">Kinder</h2>
          </StaggerItem>
          <div className="space-y-3">
            {KIDS.map((name, i) => (
              <StaggerItem key={name} delay={0.4} index={i}>
                <div className="glass-card p-4 flex items-center gap-4">
                  <Avatar name={name} size={44} index={i} />
                  <span className="font-body font-semibold text-lg text-foreground">{name}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>

        {/* VS divider */}
        <StaggerItem delay={0.6} className="flex items-center justify-center md:mt-24">
          <div className="text-muted-foreground/30 font-display text-2xl tracking-widest">VS</div>
        </StaggerItem>

        {/* Adults */}
        <div className="flex-1 max-w-sm">
          <StaggerItem delay={0.3}>
            <h2 className="text-lg font-display text-center mb-4 text-primary">Erwachsene</h2>
          </StaggerItem>
          <div className="space-y-3">
            {ADULTS.map((name, i) => (
              <StaggerItem key={name} delay={0.5} index={i}>
                <div className="glass-card p-4 flex items-center gap-4">
                  <Avatar name={name} size={44} index={i + 4} />
                  <span className="font-body font-semibold text-lg text-foreground">{name}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </div>
      </div>

      <StaggerItem delay={1}>
        <p className="text-sm text-muted-foreground font-body text-center mt-8">
          Am Ende bilden sie 4 gemischte Teams.
        </p>
      </StaggerItem>

      <NavButtons />
    </div>
  );
}
