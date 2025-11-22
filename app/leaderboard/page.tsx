"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Trophy, Medal, TrendingUp, Users, Target, Zap } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { motion } from "framer-motion"

interface LeaderboardEntry {
  id: string
  username: string
  score: number
  accuracy: number
  streak: number
  created_at: string
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly' | 'monthly'>('all')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50)

      // Apply time filter
      if (timeFilter === 'weekly') {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('created_at', oneWeekAgo)
      } else if (timeFilter === 'monthly') {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('created_at', oneMonthAgo)
      }

      const { data } = await query
      setLeaderboardData(data || [])
      setLoading(false)
    }

    fetchLeaderboard()
  }, [timeFilter])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500 w-6 h-6" />
    if (rank === 2) return <Medal className="text-gray-400 w-6 h-6" />
    if (rank === 3) return <Medal className="text-amber-700 w-6 h-6" />
    return <span className="font-mono font-bold text-gray-500">#{rank}</span>
  }

  const getRankBackground = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20'
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/20'
    if (rank === 3) return 'bg-gradient-to-r from-amber-700/10 to-amber-700/5 border-amber-700/20'
    return ''
  }

  if (loading) {
    return (
      <main className="min-h-screen px-4 pt-24 pb-12 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 pt-24 pb-12 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-6xl mx-auto">
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center"
          >
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{leaderboardData.length}</div>
            <div className="text-sm text-gray-500">Verified Humans</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center"
          >
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {leaderboardData[0]?.score.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500">Top Score</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center"
          >
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.max(...leaderboardData.map(d => d.streak), 0)}x
            </div>
            <div className="text-sm text-gray-500">Best Streak</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center"
          >
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {leaderboardData.length > 0 
                ? Math.round(leaderboardData.reduce((acc, d) => acc + d.accuracy, 0) / leaderboardData.length)
                : 0}%
            </div>
            <div className="text-sm text-gray-500">Avg Accuracy</div>
          </motion.div>
        </div>

        {/* Time Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'weekly', 'monthly'] as const).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className="capitalize"
            >
              {filter === 'all' ? 'All Time' : filter}
            </Button>
          ))}
        </div>

        {/* Leaderboard Table */}
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
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="mb-2">No scores yet</p>
                  <p className="text-sm">Be the first to verify your humanity!</p>
               </div>
            ) : (
               leaderboardData?.map((user, index) => (
                 <motion.div
                   key={user.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${getRankBackground(index + 1)}`}
                 >
                   <div className="col-span-2 flex justify-center">
                     {getRankIcon(index + 1)}
                   </div>
                   <div className="col-span-4">
                     <div className="font-medium text-lg">{user.username}</div>
                     <div className="text-xs text-gray-500">
                       {new Date(user.created_at).toLocaleDateString()}
                     </div>
                   </div>
                   <div className="col-span-2 text-right">
                     <div className="font-mono font-bold">{user.score.toLocaleString()}</div>
                   </div>
                   <div className="col-span-2 text-right">
                     <div className="text-green-600 dark:text-green-400 font-mono font-bold">{user.accuracy}%</div>
                   </div>
                   <div className="col-span-2 text-right">
                     <div className="text-amber-600 dark:text-amber-500 font-mono font-bold">{user.streak}x</div>
                   </div>
                 </motion.div>
               ))
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <div className="mb-4">
              <p className="text-gray-500 mb-2">Think you can beat them?</p>
              <p className="text-sm text-gray-400">Test your AI detection skills and climb the leaderboard</p>
            </div>
            <Link href="/game">
                <Button variant="accent" size="lg" className="gap-2">
                  <Target className="w-4 h-4" />
                  Prove It
                </Button>
            </Link>
        </div>
      </div>
    </main>
  )
}
