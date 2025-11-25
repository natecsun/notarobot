"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";

import { BLOG_POSTS } from "@/lib/blog-data";

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
