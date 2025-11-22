import { Shield, Lock, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-12 px-6 text-center text-gray-600 text-sm bg-black w-full">
       <div className="flex items-center justify-center gap-6 mb-8">
          <Shield className="w-6 h-6 text-zinc-700" />
          <Lock className="w-6 h-6 text-zinc-700" />
          <CheckCircle2 className="w-6 h-6 text-zinc-700" />
       </div>
       <p>&copy; 2024 NotARobot Inc. Built for the resistance.</p>
    </footer>
  );
}
