import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTournamentStore } from '@/store/tournament';

interface Props {
  canAdvance?: boolean;
  nextLabel?: string;
  hideBack?: boolean;
  hideNext?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export default function NavButtons({ canAdvance = true, nextLabel = 'Weiter', hideBack = false, hideNext = false, onNext, onBack }: Props) {
  const { nextScreen, prevScreen, currentScreen } = useTournamentStore();

  const handleNext = () => {
    if (onNext) onNext();
    else nextScreen();
  };

  return (
    <div className="fixed bottom-10 left-0 right-0 flex items-center justify-between px-10 z-30">
      {!hideBack && currentScreen > 0 ? (
        <button
          onClick={onBack ?? prevScreen}
          className="flex items-center gap-1 text-sm font-body opacity-40 hover:opacity-80 transition-opacity text-foreground"
        >
          <ChevronLeft size={16} />
          Zurück
        </button>
      ) : <div />}

      {!hideNext && (
        <motion.button
          onClick={handleNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.05 } : {}}
          whileTap={canAdvance ? { scale: 0.97 } : {}}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-body font-semibold text-sm transition-all ${
            canAdvance
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
          }`}
        >
          {nextLabel}
          <ChevronRight size={18} />
        </motion.button>
      )}
    </div>
  );
}
