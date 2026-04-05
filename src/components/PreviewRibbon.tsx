import { useTournamentStore } from '@/store/tournament';

export default function PreviewRibbon() {
  const isPreview = useTournamentStore(s => s.isPreview);
  if (!isPreview) return null;
  return <div className="preview-ribbon">Vorschau</div>;
}
