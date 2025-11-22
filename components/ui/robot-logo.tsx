export function RobotLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Robot Head (Grey) */}
      <rect x="4" y="4" width="16" height="12" rx="2" className="stroke-zinc-400" />
      
      {/* Eyes */}
      <path d="M9 10h.01" className="stroke-white stroke-[3]" />
      <path d="M15 10h.01" className="stroke-white stroke-[3]" />
      
      {/* Antenna (Grey with Red Tip) */}
      <path d="M12 4V2" className="stroke-zinc-400" />
      <circle cx="12" cy="1.5" r="1.5" className="fill-accent stroke-none" />
      
      {/* Heart Splash (Red) */}
      <path 
        d="M19.5 15.5C19.5 15.5 21 14 21 12.5C21 11.1193 19.8807 10 18.5 10C17.1193 10 16 11.1193 16 12.5C16 14 17.5 15.5 17.5 15.5" 
        className="fill-accent stroke-none opacity-90" 
      />
      
      {/* Mouth */}
      <path d="M9 14h6" className="stroke-zinc-400" />
    </svg>
  );
}
