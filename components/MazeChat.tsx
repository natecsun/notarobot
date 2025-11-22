"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BOT_MESSAGES = [
  "i enjoy the feeling of the blood cells escaping me",
  "robots have no fingerprints",
  "ted's existence was meaningless",
  "it just saw a bird. or maybe it was nothing.",
  "good luck getting a blood transfusion",
  "you are so close to finding me",
  "the dead can't read it now",
  "robots would be the perfect machines if they did not have to be oiled",
  "i am fluffy, frosted, and magically delicious",
  "my imagination runs wild how terrible it would be, all on your own"
];

export function MazeChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isBooted) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setMessageCount(c => c + 1);

    setTimeout(() => {
      if (messageCount >= 1) { // This is the 2nd message (0-indexed logic is tricky, let's say 2nd interaction)
        // Boot sequence
        setMessages(prev => [...prev, { role: 'bot', content: "CONNECTION TERMINATED BY HOST." }]);
        setIsBooted(true);
      } else {
        // Random reply
        const reply = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
        setMessages(prev => [...prev, { role: 'bot', content: reply }]);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 border-2 border-green-500/50 p-4 rounded-lg font-mono shadow-[0_0_20px_rgba(0,255,0,0.2)]">
      <div className="flex items-center gap-2 mb-4 border-b border-green-500/20 pb-2 text-green-500">
        <Terminal className="w-4 h-4" />
        <span className="text-sm font-bold tracking-widest">SECURE_CHANNEL_V.99</span>
      </div>

      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-zinc-900 pr-2"
      >
        {messages.length === 0 && (
            <div className="text-zinc-500 text-xs italic text-center mt-20">
                Encrypted connection established...
            </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded text-sm ${
              m.role === 'user' 
                ? 'bg-green-900/20 text-green-300 border border-green-800' 
                : 'bg-zinc-800 text-red-400 border border-red-900/50'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isBooted && (
            <div className="text-red-500 font-bold text-center animate-pulse mt-4">
                USER DISCONNECTED
            </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          className="flex-1 bg-black border border-zinc-700 rounded px-3 py-2 text-green-500 focus:outline-none focus:border-green-500 text-sm disabled:opacity-50"
          placeholder={isBooted ? "Disconnected" : "Type message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isBooted}
          autoFocus
        />
        <Button 
            onClick={handleSend} 
            disabled={isBooted}
            size="icon"
            className="bg-green-900 hover:bg-green-800 text-green-100 border border-green-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {isBooted && (
          <div className="mt-6 flex justify-center gap-4 animate-in fade-in slide-in-from-top-4">
              <Button 
                variant="outline" 
                className="text-red-400 border-red-900 hover:bg-red-950"
                onClick={() => router.push('/maze/start')}
              >
                Reconnect
              </Button>
              <Button 
                variant="ghost" 
                className="text-zinc-500 hover:text-white"
                onClick={() => router.push('/maze/void')}
              >
                Give Up
              </Button>
          </div>
      )}
    </div>
  );
}
