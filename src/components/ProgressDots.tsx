import { useTournamentStore } from '@/store/tournament';

const TOTAL = 15;

export default function ProgressDots() {
  const current = useTournamentStore(s => s.currentScreen);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
      {Array.from({ length: TOTAL }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background: i === current ? 'hsl(350, 80%, 59%)' : 'rgba(255,255,255,0.2)',
          }}
        />
      ))}
    </div>
  );
}
