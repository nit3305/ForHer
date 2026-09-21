type DecorProps = { className?: string };

export function DoodleHeart({ className = "" }: DecorProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 58" className={className} fill="none">
      <path d="M32 51C20 41 7 31 7 18 7 8 20 4 27 13l5 7 5-7C44 4 57 8 57 18c0 13-13 23-25 33Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m50 7 2-4m4 8 4-1M9 44l-4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PressedFlower({ className = "" }: DecorProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 88 130" className={className} fill="none">
      <path d="M45 124c-1-27-1-52-4-78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 75c-16-10-24-5-27 1 9 8 18 10 27 3M43 92c13-10 22-7 27-2-7 9-16 12-27 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <ellipse cx="42" cy="33" rx="9" ry="16" fill="currentColor" opacity=".2" />
      <ellipse cx="42" cy="33" rx="9" ry="16" transform="rotate(60 42 33)" fill="currentColor" opacity=".28" />
      <ellipse cx="42" cy="33" rx="9" ry="16" transform="rotate(120 42 33)" fill="currentColor" opacity=".24" />
      <circle cx="42" cy="33" r="5" fill="currentColor" opacity=".65" />
    </svg>
  );
}

export function PaperTape({ className = "" }: DecorProps) {
  return <span aria-hidden="true" className={`paper-tape ${className}`} />;
}

export function PostageMark({ className = "", label = "made for you" }: DecorProps & { label?: string }) {
  return (
    <span aria-hidden="true" className={`postage-mark ${className}`}>
      <span>♡</span>
      <small>{label}</small>
    </span>
  );
}

export function ScrapbookCorner({ className = "" }: DecorProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <PressedFlower className="h-24 w-16 text-rose/45" />
      <DoodleHeart className="absolute -right-3 top-1 h-8 w-8 rotate-12 text-wine/35" />
    </div>
  );
}
