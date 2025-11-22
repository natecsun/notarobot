import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RobotLogo } from "@/components/ui/robot-logo"
import Link from "next/link"
import { LogOut, User, CreditCard } from "lucide-react"
import { UpgradeButton } from "@/components/upgrade-button"
import { CheckoutButton } from "@/components/CheckoutButton"
import { EmptyState } from "@/components/EmptyState"

import { Confetti } from "@/components/ui/confetti"

export const dynamic = "force-dynamic";

export default async function ProfilePage({
   searchParams,
}: {
   searchParams: { success?: string; canceled?: string }
}) {
   const supabase = createClient()

   const { data: { user } } = await supabase.auth.getUser()

   if (!user) {
      return redirect("/login")
   }

   // Fetch profile data
   const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

   // Optimistically show Pro UI if success param is present
   const isPro = profile?.is_pro || searchParams?.success === "true"
   const usage = profile?.api_usage_count || 0
   // Usage limit: 5 for free, 100 for pro
   const limit = isPro ? 100 : 5
   const usagePercent = Math.min((usage / limit) * 100, 100)
   const showSuccess = searchParams?.success === "true" && isPro

   return (
      <div className="min-h-screen bg-black text-white">
         {showSuccess && <Confetti />}

         <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
               <Link href="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-3">
                  <RobotLogo className="w-8 h-8" />
                  NOTAROBOT.COM
               </Link>
               <form action="/auth/signout" method="post">
                  <Button variant="ghost" className="text-gray-400 hover:text-red-400 gap-2">
                     <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
               </form>
            </div>
         </nav>

         <main className="max-w-4xl mx-auto p-6 py-12">
            {showSuccess && (
               <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="bg-green-500 rounded-full p-2">
                     <CreditCard className="w-6 h-6 text-black" />
                  </div>
                  <div>
                     <h3 className="font-bold text-green-400 text-lg">Welcome to Pro Mode!</h3>
                     <p className="text-green-400/80 text-sm">Your account has been successfully upgraded. Enjoy unlimited access.</p>
                  </div>
               </div>
            )}

            <h1 className="text-3xl font-bold mb-8">Human Profile</h1>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Account Info */}
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <User className="w-5 h-5 text-accent" /> Account Details
                  </h2>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase">Email</label>
                        <p className="font-mono">{user.email}</p>
                     </div>
                     <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase">Username</label>
                        <p className="font-mono text-white">{profile?.username || "Anonymous"}</p>
                     </div>
                     <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase">Status</label>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold">
                           VERIFIED HUMAN
                        </span>
                     </div>
                  </div>
               </div>

               {/* Subscription / Usage */}
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <CreditCard className="w-5 h-5 text-accent" /> Subscription
                  </h2>
                  <div className="bg-black/50 rounded p-4 mb-6 border border-zinc-800">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Available Credits</span>
                        <span className="font-bold text-accent text-lg">
                           {profile?.credits || 0}
                        </span>
                     </div>
                     <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-500" style={{ width: `${Math.min(((profile?.credits || 0) / 1000) * 100, 100)}%` }}></div>
                     </div>
                     <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>1 Credit = 1 Analysis</span>
                        <span>Max: 1000</span>
                     </div>
                  </div>

                  <CheckoutButton />
               </div>
            </div>

            {/* Saved Results */}
            <div className="mt-8">
               <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-accent" /> Saved Results
               </h2>
               
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <EmptyState 
                     type="general"
                     title="No Saved Analyses Yet"
                     description="Your AI analysis results will appear here once you start using our services."
                     action={
                        <div className="flex gap-4 justify-center">
                           <Link href="/services/resume">
                              <Button className="bg-accent text-black hover:bg-accent/90">
                                 Analyze Resume
                              </Button>
                           </Link>
                           <Link href="/services/profile">
                              <Button variant="outline">
                                 Check Profile
                              </Button>
                           </Link>
                        </div>
                     }
                  />
               </div>
            </div>
         </main>
      </div>
   )
}
