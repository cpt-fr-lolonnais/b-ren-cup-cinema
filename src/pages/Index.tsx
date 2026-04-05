import { useEffect } from 'react';
import { useTournamentStore } from '@/store/tournament';
import Background from '@/components/Background';
import PreviewRibbon from '@/components/PreviewRibbon';
import ProgressDots from '@/components/ProgressDots';
import ScreenTransition from '@/components/ScreenTransition';

import TitleScreen from '@/screens/TitleScreen';
import ParticipantsScreen from '@/screens/ParticipantsScreen';
import KidsQualIntro from '@/screens/KidsQualIntro';
import KidsQualResults from '@/screens/KidsQualResults';
import TeamDraftScreen from '@/screens/TeamDraftScreen';
import AdultsQualIntro from '@/screens/AdultsQualIntro';
import AdultsQualResults from '@/screens/AdultsQualResults';
import TeamRankingScreen from '@/screens/TeamRankingScreen';
import SemiFinalsBracket from '@/screens/SemiFinalsBracket';
import SemiFinal1Results from '@/screens/SemiFinal1Results';
import SemiFinal2Results from '@/screens/SemiFinal2Results';
import FinalsMatchupScreen from '@/screens/FinalsMatchupScreen';
import SmallFinalResults from '@/screens/SmallFinalResults';
import GrandFinalResults from '@/screens/GrandFinalResults';
import ChampionRevealScreen from '@/screens/ChampionRevealScreen';

const SCREENS = [
  TitleScreen,
  ParticipantsScreen,
  KidsQualIntro,
  KidsQualResults,
  TeamDraftScreen,
  AdultsQualIntro,
  AdultsQualResults,
  TeamRankingScreen,
  SemiFinalsBracket,
  SemiFinal1Results,
  SemiFinal2Results,
  FinalsMatchupScreen,
  SmallFinalResults,
  GrandFinalResults,
  ChampionRevealScreen,
];

export default function Index() {
  const { currentScreen, nextScreen, prevScreen } = useTournamentStore();

  useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextScreen();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevScreen();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextScreen, prevScreen]);

  const CurrentScreen = SCREENS[currentScreen] ?? TitleScreen;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-main relative">
      <Background />
      <PreviewRibbon />
      <ScreenTransition screenKey={currentScreen}>
        <CurrentScreen />
      </ScreenTransition>
      {currentScreen > 0 && <ProgressDots />}
    </div>
  );
}
