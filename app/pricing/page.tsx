"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Check, Star, Zap, Crown, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/utils/supabase/client"

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoading(planId)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', planId })
      })

      const data = await response.json()
      if (response.ok) {
        window.location.href = data.url
      } else {
        if (data.error?.includes('authentication')) {
          alert('Please sign in to continue with your subscription.')
          window.location.href = '/login'
        } else if (data.error?.includes('stripe')) {
          alert('Payment service is temporarily unavailable. Please try again in a few minutes.')
        } else {
          alert(data.error || 'Unable to process subscription. Please try again.')
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Unable to connect to payment service. Please check your connection and try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleBuyCredits = async (credits: number) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoading(`credits-${credits}`)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'credits', credits })
      })

      const data = await response.json()
      if (response.ok) {
        window.location.href = data.url
      } else {
        if (data.error?.includes('authentication')) {
          alert('Please sign in to purchase credits.')
          window.location.href = '/login'
        } else if (data.error?.includes('stripe')) {
          alert('Payment service is temporarily unavailable. Please try again in a few minutes.')
        } else {
          alert(data.error || 'Unable to purchase credits. Please try again.')
        }
      }
    } catch (error) {
      console.error('Credit purchase error:', error)
      alert('Unable to connect to payment service. Please check your connection and try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <Link href="/" className="inline-block mb-12">
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>

        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Choose the plan that fits your needs. Start free, upgrade when you're ready.
          </motion.p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all"
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 mx-auto">
                <Star className="w-6 h-6 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-400 mb-4">Perfect for trying out</p>
              <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-gray-400">/month</span></div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>2 resume analyses</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>2 profile checks</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Basic essay analysis</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <span className="w-4 h-4" />
                <span>No saved results</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl border-2 border-accent bg-accent/5 p-8 hover:border-accent/50 transition-all transform hover:scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-black px-4 py-1 rounded-full text-xs font-bold">
              MOST POPULAR
            </div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 mb-4">For serious job seekers</p>
              <div className="text-4xl font-bold">$29<span className="text-lg font-normal text-gray-400">/month</span></div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>1000 credits/month</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Unlimited resume analyses</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Unlimited profile checks</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Advanced essay analysis</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Save all results</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Priority processing</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-accent text-black hover:bg-accent/90" 
              onClick={() => handleSubscribe('pro')}
              disabled={loading === 'pro'}
            >
              {loading === 'pro' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all"
          >
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-4">For teams and power users</p>
              <div className="text-4xl font-bold">$99<span className="text-lg font-normal text-gray-400">/month</span></div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>5000 credits/month</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Custom models</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Team management</span>
              </li>
            </ul>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleSubscribe('enterprise')}
              disabled={loading === 'enterprise'}
            >
              {loading === 'enterprise' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Contact Sales'
              )}
            </Button>
          </motion.div>
        </div>

        {/* Credit Packages */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Need More Credits?</h2>
          <p className="text-gray-400 mb-8">One-time credit packages that never expire</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
            >
              <div className="text-2xl font-bold mb-2">100 Credits</div>
              <div className="text-3xl font-bold mb-4">$9.99</div>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => handleBuyCredits(100)}
                disabled={loading === 'credits-100'}
              >
                {loading === 'credits-100' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
            >
              <div className="text-2xl font-bold mb-2">500 Credits</div>
              <div className="text-3xl font-bold mb-4">$39.99</div>
              <div className="text-sm text-green-500 mb-4">Save 20%</div>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => handleBuyCredits(500)}
                disabled={loading === 'credits-500'}
              >
                {loading === 'credits-500' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
            >
              <div className="text-2xl font-bold mb-2">1000 Credits</div>
              <div className="text-3xl font-bold mb-4">$69.99</div>
              <div className="text-sm text-green-500 mb-4">Save 30%</div>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => handleBuyCredits(1000)}
                disabled={loading === 'credits-1000'}
              >
                {loading === 'credits-1000' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-bold mb-2">How do credits work?</h3>
              <p className="text-gray-400 text-sm">Each resume analysis costs 1 credit. Profile checks and essay analyses use credits based on complexity.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Do credits expire?</h3>
              <p className="text-gray-400 text-sm">One-time credit purchases never expire. Subscription credits reset monthly.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">Yes, you can cancel your subscription at any time. Your credits remain valid until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">We accept all major credit cards, debit cards, and PayPal through Stripe.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
