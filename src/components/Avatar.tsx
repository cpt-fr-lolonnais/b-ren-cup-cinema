import { AVATAR_COLORS } from '@/store/tournament';

interface Props {
  name: string;
  size?: number;
  borderColor?: string;
  index?: number;
}

export default function Avatar({ name, size = 48, borderColor, index }: Props) {
  const colorIdx = index ?? (name.charCodeAt(0) + name.length) % AVATAR_COLORS.length;
  const bg = AVATAR_COLORS[colorIdx];

  return (
    <div
      className="flex items-center justify-center rounded-full font-display font-bold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: bg,
        color: '#fff',
        border: borderColor ? `3px solid ${borderColor}` : 'none',
        boxShadow: borderColor ? `0 0 12px ${borderColor}40` : undefined,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
