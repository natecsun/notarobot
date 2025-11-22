"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

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
  const [gameState, setGameState] = useState<'playing' | 'result' | 'finished'>('playing');
  const [lastGuessCorrect, setLastGuessCorrect] = useState(false);

  const currentItem = MOCK_DATA[currentIndex];

  const handleGuess = (guessAi: boolean) => {
    const isCorrect = guessAi === currentItem.isAi;
    setLastGuessCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(s => s + 100 + (streak * 10));
      setStreak(s => s + 1);
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
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setGameState('playing');
  };

  if (gameState === 'finished') {
    return (
      <div className="text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-6">Final Score: <span className="text-accent font-mono">{score}</span></p>
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
            className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800 min-h-[300px] flex flex-col justify-center items-center text-center"
          >
            {currentItem.type === 'text' ? (
              <p className="text-xl md:text-2xl font-serif leading-relaxed">
                "{currentItem.content}"
              </p>
            ) : (
              <div className="bg-gray-200 w-full h-64 flex items-center justify-center text-gray-500">
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
