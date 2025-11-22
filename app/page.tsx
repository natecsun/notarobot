import { Button } from "@/components/ui/button";
import { Shield, FileSearch, UserX, GraduationCap, Trophy, Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <span className="text-accent font-bold mr-2">&lt;NOT&gt;</span>
          A ROBOT
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Button variant="ghost" className="gap-2">
             Login
          </Button>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-accent/20 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t from-blue-200 via-blue-200 blur-2xl content-[''] z-[-1]">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Prove Humanity.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The internet is flooding with AI. We provide the tools to verify reality, sanitize your content, and prove you aren't just another LLM wrapper.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/game">
              <Button variant="accent" size="lg" className="gap-2 text-lg">
                <Play className="w-5 h-5" /> Play Real vs AI
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>

      <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-6 mt-16">
        <FeatureCard 
          title="Resume Sanitizer" 
          description="Recruiters are tired of ChatGPT resumes. Humanize your CV to pass the 'robot smell' test."
          icon={<FileSearch className="w-8 h-8 mb-4 text-accent" />}
          href="/services/resume"
        />
        <FeatureCard 
          title="Fake Profile Spotter" 
          description="Dating apps are full of bots. Upload a profile screenshot to detect generated images and bio text."
          icon={<UserX className="w-8 h-8 mb-4 text-accent" />}
          href="/services/profile"
        />
        <FeatureCard 
          title="Essay Integrity" 
          description="For professors and students. Verify the authenticity of academic work with advanced stylometry."
          icon={<GraduationCap className="w-8 h-8 mb-4 text-accent" />}
          href="/services/essay"
        />
      </div>

      <div className="mt-20 w-full max-w-5xl">
         <div className="border rounded-xl p-8 bg-zinc-900/50 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Global Human Leaderboard
              </h2>
              <Link href="/leaderboard" className="text-accent hover:underline text-sm">View All</Link>
            </div>
            <div className="space-y-4">
               <LeaderboardRow rank={1} name="Sarah_Real" score={9850} accuracy="99.2%" />
               <LeaderboardRow rank={2} name="NotABot_99" score={9420} accuracy="98.5%" />
               <LeaderboardRow rank={3} name="Turing_Test_Passed" score={8900} accuracy="97.8%" />
            </div>
         </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon, href }: { title: string, description: string, icon: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      {icon}
      <h2 className="mb-3 text-2xl font-semibold">
        {title}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-50">
        {description}
      </p>
    </Link>
  );
}

function LeaderboardRow({ rank, name, score, accuracy }: { rank: number, name: string, score: number, accuracy: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded bg-white/5">
       <div className="flex items-center gap-4">
          <span className={`font-mono font-bold w-6 text-center ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-600' : 'text-gray-600'}`}>#{rank}</span>
          <span className="font-medium">{name}</span>
       </div>
       <div className="flex gap-8 text-sm text-gray-400">
          <span>Score: <span className="text-white">{score}</span></span>
          <span>Acc: <span className="text-accent">{accuracy}</span></span>
       </div>
    </div>
  )
}
