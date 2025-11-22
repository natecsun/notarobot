import { RealOrAI } from "@/components/game/RealOrAI";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  return (
    <main className="min-h-screen px-4 pt-24 pb-12 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Real or AI?</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Test your ability to distinguish human creativity from machine generation.
          </p>
        </div>

        <RealOrAI />
      </div>
    </main>
  );
}
