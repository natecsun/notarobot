import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const supabase = createClient();
  
  const { data: leaderboardData } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen px-4 pt-24 pb-12 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
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
            {leaderboardData?.length === 0 ? (
               <div className="p-8 text-center text-gray-500">
                  No scores yet. Be the first to verify your humanity!
               </div>
            ) : (
               leaderboardData?.map((user, index) => (
                 <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                   <div className="col-span-2 flex justify-center">
                     {index + 1 === 1 && <Medal className="text-yellow-500 w-6 h-6" />}
                     {index + 1 === 2 && <Medal className="text-gray-400 w-6 h-6" />}
                     {index + 1 === 3 && <Medal className="text-amber-700 w-6 h-6" />}
                     {index + 1 > 3 && <span className="font-mono font-bold text-gray-500">#{index + 1}</span>}
                   </div>
                   <div className="col-span-4 font-medium text-lg">{user.username}</div>
                   <div className="col-span-2 text-right font-mono">{user.score.toLocaleString()}</div>
                   <div className="col-span-2 text-right text-green-600 dark:text-green-400 font-mono">{user.accuracy}%</div>
                   <div className="col-span-2 text-right text-amber-600 dark:text-amber-500 font-mono">{user.streak}x</div>
                 </div>
               ))
            )}
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
