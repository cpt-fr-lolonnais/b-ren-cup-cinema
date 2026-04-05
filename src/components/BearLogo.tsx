interface Props {
  size?: number;
  glow?: boolean;
  className?: string;
}

export default function BearLogo({ size = 120, glow = false, className = '' }: Props) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, hsl(350 80% 59% / 0.3) 0%, transparent 70%)',
            transform: 'scale(1.5)',
          }}
        />
      )}
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        {/* Bear paw print */}
        {/* Main pad */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="hsl(350, 80%, 59%)" opacity="0.9" />
        {/* Toe pads */}
        <circle cx="30" cy="38" r="9" fill="hsl(350, 80%, 59%)" opacity="0.8" />
        <circle cx="50" cy="32" r="9" fill="hsl(350, 80%, 59%)" opacity="0.8" />
        <circle cx="70" cy="38" r="9" fill="hsl(350, 80%, 59%)" opacity="0.8" />
        {/* Small claw marks */}
        <circle cx="23" cy="28" r="3" fill="hsl(350, 80%, 70%)" opacity="0.6" />
        <circle cx="50" cy="22" r="3" fill="hsl(350, 80%, 70%)" opacity="0.6" />
        <circle cx="77" cy="28" r="3" fill="hsl(350, 80%, 70%)" opacity="0.6" />
      </svg>
    </div>
  );
}
