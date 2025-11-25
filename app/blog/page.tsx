"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";

// Blog posts data - in production, this would come from a CMS or MDX files
const BLOG_POSTS = [
  {
    slug: "how-to-spot-ai-generated-resume",
    title: "How to Spot an AI-Generated Resume in 2024",
    excerpt: "Recruiters are getting smarter. Your ChatGPT-polished resume might be getting auto-rejected. Here's what they're looking for.",
    author: "The Team",
    date: "2024-12-01",
    readTime: "5 min",
    category: "Guides",
    featured: true,
  },
  {
    slug: "dead-internet-theory-explained",
    title: "Dead Internet Theory: Is Everyone Online Actually a Bot?",
    excerpt: "The conspiracy theory that won't die. We investigate how much of the internet is actually automated, and why it matters.",
    author: "The Team",
    date: "2024-11-28",
    readTime: "8 min",
    category: "Deep Dives",
    featured: true,
  },
  {
    slug: "dating-app-bots-detection",
    title: "Your Tinder Match Might Be a Bot: A Detection Guide",
    excerpt: "GAN-generated faces, scripted conversations, and suspiciously perfect profiles. Learn to protect your heart (and data).",
    author: "The Team",
    date: "2024-11-20",
    readTime: "6 min",
    category: "Guides",
  },
  {
    slug: "ats-systems-explained",
    title: "ATS Systems: Why Your Resume Gets Rejected Before Humans See It",
    excerpt: "The robots gatekeeping your job applications. Understanding how ATS works and how to optimize for both machines and humans.",
    author: "The Team",
    date: "2024-11-15",
    readTime: "7 min",
    category: "Career",
  },
  {
    slug: "ai-detection-tools-comparison",
    title: "AI Detection Tools Compared: Which Actually Work?",
    excerpt: "We tested GPTZero, Originality.ai, and others against real AI content. The results might surprise you.",
    author: "The Team",
    date: "2024-11-10",
    readTime: "10 min",
    category: "Reviews",
  },
  {
    slug: "future-of-human-verification",
    title: "The Future of Proving You're Human",
    excerpt: "CAPTCHAs are dying. Biometrics are creepy. What comes next in the battle between humans and machines?",
    author: "The Team",
    date: "2024-11-05",
    readTime: "6 min",
    category: "Future",
  },
];

export default function BlogPage() {
  const featuredPosts = BLOG_POSTS.filter(p => p.featured);
  const regularPosts = BLOG_POSTS.filter(p => !p.featured);

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 mb-8 hover:bg-transparent hover:text-accent">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
              The <span className="text-accent">Resistance</span> Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Intel, guides, and manifestos from the front lines of the human-machine divide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-mono text-accent mb-6">// FEATURED</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-accent/50 transition-all duration-300 h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 text-xs font-mono bg-accent/10 text-accent rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-accent group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="pb-24 px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto pt-16">
          <h2 className="text-sm font-mono text-gray-500 mb-6">// ALL POSTS</h2>
          
          <div className="space-y-4">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all flex items-center justify-between gap-4 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs font-mono bg-zinc-800 text-gray-400 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-600">{post.readTime}</span>
                      </div>
                      <h3 className="font-bold group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {post.date}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
          <p className="text-gray-400 mb-6">
            Get weekly intel on AI detection, human verification, and survival guides for the digital age.
          </p>
          <Link href="/#waitlist">
            <Button className="bg-accent text-black hover:bg-accent/90">
              Join the Resistance
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
