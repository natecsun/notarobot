"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RobotLogo } from "@/components/ui/robot-logo";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Link href="/" className="hover:animate-pulse">
                <RobotLogo className="w-8 h-8 text-accent" />
            </Link>
            <Link href="/" className="font-mono font-bold text-xl tracking-tighter text-white hover:opacity-90 transition-opacity">
                <span className="hidden sm:inline">NOTAROBOT.COM</span>
                <span className="sm:hidden">NAR</span>
            </Link>
         </div>
         <div className="flex items-center gap-4">
            {/* Nav Links - visible on larger screens */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/about" className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/blog" className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/pricing" className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>

            {user ? (
              <>
                <Link href="/dashboard">
                   <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <UserIcon className="w-4 h-4 mr-2" /> Dashboard
                   </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-red-400"
                  onClick={handleSignOut}
                >
                   <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
                <Link href="/game">
                  <Button size="sm" variant="accent" className="border border-accent shadow-[0_0_10px_rgba(255,51,51,0.3)]">
                     Start Verifying
                  </Button>
                </Link>
              </>
            )}
         </div>
      </div>
    </nav>
  );
}
