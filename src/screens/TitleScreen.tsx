import { motion } from 'framer-motion';
import BearLogo from '@/components/BearLogo';
import { SlideDown, StaggerItem } from '@/components/Stagger';
import { useTournamentStore } from '@/store/tournament';

export default function TitleScreen() {
  const setPreview = useTournamentStore(s => s.setPreview);
  const resetAll = useTournamentStore(s => s.resetAll);
  const setScreen = useTournamentStore(s => s.setScreen);
  const loadDemoData = useTournamentStore(s => s.loadDemoData);
  const isPreview = useTournamentStore(s => s.isPreview);

  const startPreview = () => {
    loadDemoData();
    setScreen(1);
  };

  const startLive = () => {
    if (window.confirm('Alle Ergebnisse werden zurückgesetzt. Turnier wirklich starten?')) {
      resetAll();
    }
  };

  const backToPreview = () => {
    loadDemoData();
    setPreview(true);
    setScreen(0);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <SlideDown delay={0.1}>
        <BearLogo size={140} glow className="mb-6" />
      </SlideDown>

      <SlideDown delay={0.3}>
        <h1 className="text-6xl md:text-8xl font-display glow-accent tracking-wider mb-2">
          BÄREN CUP
        </h1>
      </SlideDown>

      <StaggerItem delay={0.5}>
        <p className="text-xl md:text-2xl text-muted-foreground font-body tracking-wide mb-12">
          Mario Kart Grand Prix
        </p>
      </StaggerItem>

      <StaggerItem delay={0.7} className="flex flex-col sm:flex-row gap-4 items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={startPreview}
          className="px-8 py-3 rounded-full font-body font-semibold border border-primary/50 text-foreground hover:bg-primary/10 transition-colors"
        >
          Vorschau starten
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={startLive}
          className="px-8 py-3 rounded-full font-body font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/30"
        >
          Turnier starten
        </motion.button>
      </StaggerItem>

      {!isPreview && (
        <StaggerItem delay={0.9}>
          <button
            onClick={backToPreview}
            className="mt-6 text-xs text-muted-foreground/50 hover:text-muted-foreground transition font-body underline"
          >
            Zurück zur Vorschau
          </button>
        </StaggerItem>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 flex">
        {['#e94560', '#4361ee', '#06d6a0', '#ffd166', '#e94560', '#4361ee'].map((c, i) => (
          <div key={i} className="flex-1 h-full" style={{ background: c, opacity: 0.4 }} />
        ))}
      </div>
    </div>
  );
}
