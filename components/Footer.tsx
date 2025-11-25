import { Shield, Lock, CheckCircle2, Bot, Terminal } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-12 px-6 text-center text-gray-600 text-sm bg-black w-full">
       <div className="flex items-center justify-center gap-6 mb-8">
          <Shield className="w-6 h-6 text-zinc-700 hover:text-accent transition-colors" />
          <Lock className="w-6 h-6 text-zinc-700 hover:text-accent transition-colors" />
          <CheckCircle2 className="w-6 h-6 text-zinc-700 hover:text-accent transition-colors" />
          
          {/* Randy Easter Egg - more discoverable now */}
          <Link 
            href="/randy" 
            className="group relative"
            title="???"
          >
            <Bot className="w-6 h-6 text-zinc-800 hover:text-yellow-500 transition-all duration-500 group-hover:animate-pulse" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-yellow-500/0 group-hover:text-yellow-500 transition-all duration-300 whitespace-nowrap font-mono">
              psst... click me
            </span>
          </Link>
       </div>
       
       <p className="mb-4">&copy; 2024 NotARobot Inc. Built for the resistance.</p>
       
       {/* Cryptic footer message */}
       <div className="flex items-center justify-center gap-2 text-xs text-zinc-700 font-mono">
         <Terminal className="w-3 h-3" />
         <span className="hover:text-zinc-500 transition-colors cursor-default">
           are you still reading? good. stay vigilant.
         </span>
       </div>
       
       {/* Hidden message for the curious */}
       <p className="mt-6 text-zinc-900 hover:text-zinc-600 transition-colors duration-1000 text-xs cursor-default select-none">
         robots would never think to look here
       </p>
    </footer>
  );
}
