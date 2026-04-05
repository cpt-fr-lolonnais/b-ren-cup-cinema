import { useCallback } from 'react';
import { useTournamentStore, ADULTS, DEMO_ADULTS_QUAL, RaceResult } from '@/store/tournament';
import RaceResultInput from '@/components/RaceResultInput';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function AdultsQualResults() {
  const { isPreview, setAdultsQualification, adultsQualification, teams } = useTournamentStore();

  const handleComplete = useCallback((results: RaceResult[]) => {
    setAdultsQualification(results);
  }, [setAdultsQualification]);

  const canAdvance = adultsQualification.length === 4 && adultsQualification.every(r => r.gpPoints > 0);

  return (
    <div className="flex flex-col items-center justify-start px-6 max-w-3xl mx-auto w-full h-full overflow-y-auto py-12">
      <SlideDown>
        <h1 className="text-2xl md:text-4xl font-display text-center mb-2 glow-accent">
          ERWACHSENEN-QUALIFIKATION
        </h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-6">Ergebnis</p>
      </StaggerItem>

      <StaggerItem delay={0.3}>
        <RaceResultInput
          participants={[...ADULTS]}
          onComplete={handleComplete}
          isPreview={isPreview}
          previewResults={DEMO_ADULTS_QUAL}
          showTeamColors
        />
      </StaggerItem>

      <NavButtons canAdvance={canAdvance} />
    </div>
  );
}
