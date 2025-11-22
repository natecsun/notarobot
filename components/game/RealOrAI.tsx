"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type GameItem = {
  id: string;
  type: 'image' | 'text';
  content: string;
  isAi: boolean;
  source?: string; // e.g. "Midjourney v6" or "Photo by Unsplash"
};

const MOCK_DATA: GameItem[] = [
  {
    id: '1',
    type: 'text',
    content: "The intricate dance of shadows on the cobblestone street whispered secrets of a bygone era, where gas lamps flickered like dying stars against the encroaching velvet of night.",
    isAi: true,
    source: "GPT-4o"
  },
  {
    id: '2',
    type: 'text',
    content: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    isAi: false,
    source: "Moby Dick"
  },
  {
    id: '3',
    type: 'text',
    content: "In the heart of the digital expanse, neurons of light fired in synchronized harmony, constructing a reality that was indistinguishable from the organic chaos of the physical realm.",
    isAi: true,
    source: "Claude 3 Opus"
  }
];

export function RealOrAI() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'result' | 'finished'>('playing');
  const [lastGuessCorrect, setLastGuessCorrect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const currentItem = MOCK_DATA[currentIndex];

  const handleGuess = (guessAi: boolean) => {
    const isCorrect = guessAi === currentItem.isAi;
    setLastGuessCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(s => s + 100 + (streak * 10));
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(ms => Math.max(ms, newStreak));
      setCorrectCount(c => c + 1);
    } else {
      setStreak(0);
    }
    
    setGameState('result');
  };

  const nextRound = () => {
    if (currentIndex < MOCK_DATA.length - 1) {
      setCurrentIndex(i => i + 1);
      setGameState('playing');
    } else {
      setGameState('finished');
      saveScore();
    }
  };

  const saveScore = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return; // Don't save if not logged in

      // Get profile for username
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      const accuracy = (correctCount / MOCK_DATA.length) * 100;

      await supabase.from('leaderboard').insert({
        user_id: user.id,
        username: profile?.username || user.email?.split('@')[0] || 'Anonymous',
        score,
        accuracy,
        streak: maxStreak
      });
      
      router.refresh(); // Refresh to update leaderboard if user navigates there
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setGameState('playing');
  };

  if (gameState === 'finished') {
    return (
      <div className="text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-2">Final Score: <span className="text-accent font-mono">{score}</span></p>
        <p className="text-gray-400 mb-6">
          Accuracy: {Math.round((correctCount / MOCK_DATA.length) * 100)}% | 
          Best Streak: {maxStreak}
        </p>
        
        {isSaving && <p className="text-sm text-gray-500 mb-4">Saving to leaderboard...</p>}
        
        <Button onClick={resetGame} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 text-sm font-mono">
        <div className="flex gap-4">
          <span>SCORE: {score}</span>
          <span className={streak > 2 ? "text-yellow-500" : "text-gray-500"}>
            STREAK: {streak}x
          </span>
        </div>
        <div>{currentIndex + 1} / {MOCK_DATA.length}</div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-zinc-900 rounded-xl p-8 shadow-xl border border-zinc-800 min-h-[300px] flex flex-col justify-center items-center text-center"
          >
            {currentItem.type === 'text' ? (
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-white">
                "{currentItem.content}"
              </p>
            ) : (
              <div className="bg-zinc-800 w-full h-64 flex items-center justify-center text-gray-400 rounded-lg">
                [Image Placeholder]
              </div>
            )}

            <div className="flex gap-4 mt-8 w-full justify-center">
              <Button 
                onClick={() => handleGuess(false)} 
                variant="outline" 
                className="w-32 h-12 text-lg border-2 hover:bg-green-500/10 hover:border-green-500 hover:text-green-500"
              >
                Human
              </Button>
              <Button 
                onClick={() => handleGuess(true)} 
                variant="outline" 
                className="w-32 h-12 text-lg border-2 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500"
              >
                Robot
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl p-8 shadow-xl min-h-[300px] flex flex-col justify-center items-center text-center border ${lastGuessCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}
          >
            {lastGuessCorrect ? (
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
            )}
            
            <h3 className="text-2xl font-bold mb-2">
              {lastGuessCorrect ? "Correct!" : "Wrong!"}
            </h3>
            
            <p className="text-lg mb-6 text-gray-400">
              It was <span className="font-bold text-white">{currentItem.isAi ? "AI Generated" : "Human Made"}</span>
              {currentItem.source && <span className="block text-sm mt-1">Source: {currentItem.source}</span>}
            </p>

            <Button onClick={nextRound} size="lg">
              Next Round
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
