import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Sarah_Real", score: 9850, accuracy: "99.2%", streak: 45 },
  { rank: 2, name: "NotABot_99", score: 9420, accuracy: "98.5%", streak: 32 },
  { rank: 3, name: "Turing_Test_Passed", score: 8900, accuracy: "97.8%", streak: 28 },
  { rank: 4, name: "Human_Being_1", score: 8500, accuracy: "95.0%", streak: 15 },
  { rank: 5, name: "DaVinci_Code", score: 8200, accuracy: "94.5%", streak: 12 },
  { rank: 6, name: "BladeRunner", score: 7800, accuracy: "91.2%", streak: 10 },
  { rank: 7, name: "Neo", score: 7500, accuracy: "90.0%", streak: 8 },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Hall of Humanity
          </h1>
        </div>

        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-sm text-gray-500 uppercase tracking-wider">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-2 text-right">Accuracy</div>
            <div className="col-span-2 text-right">Best Streak</div>
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {LEADERBOARD_DATA.map((user) => (
              <div key={user.rank} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="col-span-2 flex justify-center">
                  {user.rank === 1 && <Medal className="text-yellow-500 w-6 h-6" />}
                  {user.rank === 2 && <Medal className="text-gray-400 w-6 h-6" />}
                  {user.rank === 3 && <Medal className="text-amber-700 w-6 h-6" />}
                  {user.rank > 3 && <span className="font-mono font-bold text-gray-500">#{user.rank}</span>}
                </div>
                <div className="col-span-4 font-medium text-lg">{user.name}</div>
                <div className="col-span-2 text-right font-mono">{user.score}</div>
                <div className="col-span-2 text-right text-green-600 dark:text-green-400 font-mono">{user.accuracy}</div>
                <div className="col-span-2 text-right text-amber-600 dark:text-amber-500 font-mono">{user.streak}x</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Think you can beat them?</p>
            <Link href="/game">
                <Button variant="accent" size="lg" className="gap-2">
                    Prove It
                </Button>
            </Link>
        </div>
      </div>
    </main>
  );
}
