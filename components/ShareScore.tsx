"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Link2, Check, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareScoreProps {
  score: number;
  accuracy: number;
  streak: number;
}

export function ShareScore({ score, accuracy, streak }: ShareScoreProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://www.notarobot.com/game`;
  const shareText = `🧠 I scored ${score} points on NotARobot's Real vs AI game with ${accuracy}% accuracy! Can you beat my score? Prove you're human:`;
  const ogImageUrl = `https://www.notarobot.com/api/og?type=game&score=${score}&accuracy=${accuracy}&streak=${streak}`;

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    // Open OG image in new tab for download
    window.open(ogImageUrl, '_blank');
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="outline"
        className="gap-2 border-accent/50 hover:bg-accent/10"
      >
        <Share2 className="w-4 h-4" />
        Share Score
      </Button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-xl z-50 min-w-[200px]"
          >
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Share on Twitter</span>
            </button>
            
            <button
              onClick={handleLinkedInShare}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
            >
              <Linkedin className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Share on LinkedIn</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Link2 className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <div className="border-t border-zinc-800 my-2" />
            
            <button
              onClick={handleDownloadImage}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
            >
              <Download className="w-4 h-4 text-accent" />
              <span className="text-sm">Download Share Card</span>
            </button>

            {/* Preview */}
            <div className="mt-2 p-2 bg-black rounded-lg border border-zinc-800">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="bg-zinc-950 rounded p-3 text-center">
                <p className="text-2xl font-bold text-accent">{score}</p>
                <p className="text-xs text-gray-500">points • {accuracy}% accuracy</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
