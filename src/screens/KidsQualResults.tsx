import { useCallback } from 'react';
import { useTournamentStore, KIDS, DEMO_KIDS_QUAL, RaceResult } from '@/store/tournament';
import RaceResultInput from '@/components/RaceResultInput';
import NavButtons from '@/components/NavButtons';
import { SlideDown, StaggerItem } from '@/components/Stagger';

export default function KidsQualResults() {
  const { isPreview, setKidsQualification, kidsQualification, nextScreen } = useTournamentStore();

  const handleComplete = useCallback((results: RaceResult[]) => {
    setKidsQualification(results);
  }, [setKidsQualification]);

  const canAdvance = kidsQualification.length === 4 && kidsQualification.every(r => r.gpPoints > 0);

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <SlideDown>
        <h1 className="text-2xl md:text-4xl font-display text-center mb-2 glow-accent">
          KINDER-QUALIFIKATION
        </h1>
      </SlideDown>
      <StaggerItem delay={0.2}>
        <p className="text-muted-foreground font-body text-center mb-6">Ergebnis</p>
      </StaggerItem>

      <StaggerItem delay={0.3}>
        <RaceResultInput
          participants={[...KIDS]}
          onComplete={handleComplete}
          isPreview={isPreview}
          previewResults={DEMO_KIDS_QUAL}
        />
      </StaggerItem>

      <NavButtons canAdvance={canAdvance} />
    </div>
  );
}
