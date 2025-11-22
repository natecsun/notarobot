"use client";

import { useEffect } from "react";

const MESSAGES = [
  "robots have no fingerprints.",
  "it will be hard to identify them after they murder your family",
  "fun fact: robots are on mars",
  "if you are the only human left, good luck getting a blood transfusion unless your blood type is 10w-40",
  "robots have only one known weakness: they do not understand love",
  "lost little robot",
  "you are so close to finding me",
  "wayne's page of nothing",
  "i enjoy the feeling of the blood cells escaping me like prisoners"
];

export function VibeLogger() {
  useEffect(() => {
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    console.log(
      `%c 🤖 ${randomMessage}`,
      "color: #FACC15; background: #000; font-size: 14px; padding: 4px; border-radius: 4px;"
    );
    
    // Konami Code Listener for fun
    let keys: string[] = [];
    const konami = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";
    
    const handleKeydown = (e: KeyboardEvent) => {
      keys.push(e.key);
      if (keys.length > 10) keys.shift();
      if (keys.join(",") === konami) {
        alert("RANDY IS WATCHING");
        window.location.href = "/randy";
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return null;
}
