'use client';

export function SplashScreen() {
  return (
    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <svg
        className="w-20 h-20 text-teal-400 animated-logo"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="3" />
        <path d="M26 12V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M38 12V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M26 52V60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M38 52V60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 26H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 38H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 26H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 38H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 24H30V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 40H34V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h1 className="text-4xl font-bold text-white tracking-wider mt-4 splash-text">
        MobiTec
      </h1>
    </div>
  );
}
