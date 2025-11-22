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
    source: "GPT-4o (Creative Writing)"
  },
  {
    id: '2',
    type: 'text',
    content: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    isAi: false,
    source: "Moby Dick by Herman Melville"
  },
  {
    id: '3',
    type: 'text',
    content: "In the heart of the digital expanse, neurons of light fired in synchronized harmony, constructing a reality that was indistinguishable from the organic chaos of the physical realm.",
    isAi: true,
    source: "Claude 3 Opus"
  },
  {
    id: '4',
    type: 'text',
    content: "yo u coming 2nite? sarah brought the dip lol",
    isAi: false,
    source: "Average Text Message"
  },
  {
    id: '5',
    type: 'text',
    content: "Here's a Python function to calculate the Fibonacci sequence:\n\ndef fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    sequence = [0, 1]\n    while len(sequence) < n:\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence",
    isAi: true,
    source: "GitHub Copilot"
  },
  {
    id: '6',
    type: 'text',
    content: "I saw the best minds of my generation destroyed by madness, starving hysterical naked, dragging themselves through the negro streets at dawn looking for an angry fix.",
    isAi: false,
    source: "Howl by Allen Ginsberg"
  },
  {
    id: '7',
    type: 'text',
    content: "Certainly! I can help you with that. To bake a chocolate cake, you will need flour, sugar, cocoa powder, baking powder, and eggs. First, preheat your oven to 350°F (175°C).",
    isAi: true,
    source: "ChatGPT (Standard Response)"
  },
  {
    id: '8',
    type: 'text',
    content: "Just pushed the fix to prod. Fingers crossed it doesn't break the payment gateway again. Coffee time.",
    isAi: false,
    source: "Slack Message (Human Dev)"
  },
  {
    id: '9',
    type: 'text',
    content: "The tapestry of human experience is woven with threads of joy and sorrow, each creating a unique pattern that defines our existence in this vast, indifferent universe.",
    isAi: true,
    source: "Llama 3 (Philosophical Mode)"
  },
  {
    id: '10',
    type: 'text',
    content: "For sale: baby shoes, never worn.",
    isAi: false,
    source: "Ernest Hemingway (Attributed)"
  },
  {
    id: '11',
    type: 'text',
    content: "As an AI language model, I cannot predict the future or offer financial advice. However, historical trends suggest that market volatility is common during election years.",
    isAi: true,
    source: "ChatGPT (Safety Rails)"
  },
  {
    id: '12',
    type: 'text',
    content: "The sky was the color of television, tuned to a dead channel.",
    isAi: false,
    source: "Neuromancer by William Gibson"
  },
  {
    id: '13',
    type: 'text',
    content: "User authentication is handled via a JWT token stored in an HTTP-only cookie to prevent XSS attacks. The middleware validates this token on every protected route.",
    isAi: true,
    source: "Technical Documentation (AI Generated)"
  },
  {
    id: '14',
    type: 'text',
    content: "LOL that cat video is insane. did u see the part where he jumps?? 💀",
    isAi: false,
    source: "YouTube Comment"
  },
  {
    id: '15',
    type: 'text',
    content: "It was a bright cold day in April, and the clocks were striking thirteen.",
    isAi: false,
    source: "1984 by George Orwell"
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
