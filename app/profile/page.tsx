import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RobotLogo } from "@/components/ui/robot-logo"
import Link from "next/link"
import { LogOut, User, CreditCard } from "lucide-react"
import { UpgradeButton } from "@/components/upgrade-button"
import { CheckoutButton } from "@/components/CheckoutButton"

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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

   const isPro = profile?.is_pro || false
   const usage = profile?.api_usage_count || 0
   // Usage limit: 5 for free, 100 for pro
   const limit = isPro ? 100 : 5
   const usagePercent = Math.min((usage / limit) * 100, 100)

   return (
      <div className="min-h-screen bg-black text-white">
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
                        <span className="text-sm text-gray-400">Current Plan</span>
                        <span className={`font-bold ${isPro ? 'text-accent' : 'text-white'}`}>
                           {isPro ? 'PRO TIER' : 'Free Tier'}
                        </span>
                     </div>
                     <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-accent h-full transition-all duration-500" style={{ width: `${usagePercent}%` }}></div>
                     </div>
                     <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Daily API Usage</span>
                        <span>{usage} / {limit}</span>
                     </div>
                  </div>

                  {!isPro && (
                     <CheckoutButton />
                  )}
               </div>
            </div>
         </main>
      </div>
   )
}
