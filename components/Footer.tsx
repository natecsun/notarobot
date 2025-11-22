import { Shield, Lock, CheckCircle2, Bot } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-12 px-6 text-center text-gray-600 text-sm bg-black w-full">
       <div className="flex items-center justify-center gap-6 mb-8">
          <Shield className="w-6 h-6 text-zinc-700" />
          <Lock className="w-6 h-6 text-zinc-700" />
          <CheckCircle2 className="w-6 h-6 text-zinc-700" />
          <Link href="/randy" className="opacity-0 hover:opacity-50 transition-opacity duration-1000">
            <Bot className="w-6 h-6 text-yellow-500" />
          </Link>
       </div>
       <p>&copy; 2024 NotARobot Inc. Built for the resistance.</p>
    </footer>
  );
}
