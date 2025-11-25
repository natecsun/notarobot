"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, CheckCircle, TrendingUp, Users, Briefcase } from "lucide-react";

const CASE_STUDIES = [
  {
    id: "sarah-software-engineer",
    name: "Sarah K.",
    role: "Software Engineer",
    company: "Now at a Fortune 500",
    image: "👩‍💻",
    challenge: "47 applications, 0 responses",
    result: "Landed dream job in 3 weeks",
    stats: {
      before: "12% response rate",
      after: "68% response rate",
      interviews: "8 interviews",
    },
    story: `After getting laid off, I spent two months applying to jobs with zero callbacks. I knew my experience was solid—5 years at a well-known startup—but something wasn't clicking.

A recruiter friend finally told me the truth: "Your resume reads like ChatGPT wrote it." I was mortified. I'd used AI to "polish" it, thinking I was being smart.

I found NotARobot and ran my resume through the sanitizer. The AI probability score? 73%. No wonder I was getting ghosted.

The tool highlighted exactly which phrases screamed "robot"—phrases like "leveraged cross-functional collaboration" that I thought sounded professional but actually just sounded... algorithmic.

After humanizing my resume with the tool's suggestions, my response rate went from 12% to 68%. I had 8 interviews in three weeks and accepted an offer at a Fortune 500 company.

The irony? I'm now the one screening resumes. And yes, I can spot the AI-written ones immediately.`,
    tags: ["Resume Sanitizer", "Job Search", "Tech Industry"],
  },
  {
    id: "marcus-catfish-survivor",
    name: "Marcus T.",
    role: "Marketing Manager",
    company: "Los Angeles, CA",
    image: "👨‍💼",
    challenge: "Fell for an AI-generated profile",
    result: "Now helps others avoid scams",
    stats: {
      before: "3 months of fake relationship",
      after: "Spotted 12 fake profiles",
      saved: "~$5,000 in potential scam",
    },
    story: `I matched with "Jessica" on a dating app. Perfect smile, interesting bio about traveling and dogs, great conversation. We talked for three months before I started getting suspicious.

She always had excuses for video calls. Her responses came at odd hours. And when I asked specific questions about her hometown, her answers were vague.

I uploaded her profile photo to NotARobot's fake profile detector. The result? 94% probability of AI-generated image. The GAN artifacts were subtle—slight asymmetry in her earrings, background that didn't quite make sense—but they were there.

I dug deeper. Her bio hit every ChatGPT marker: "Looking for something real," "love authentic connections," generic interests. It was textbook.

I reported the profile and it was removed within 24 hours. Looking back, I'm embarrassed I didn't catch it sooner. But these fakes are getting sophisticated.

Now I run every match through the detector before investing emotionally. I've flagged 12 fake profiles in the past six months. It's sad that this is necessary, but it's the world we live in.`,
    tags: ["Fake Profile Spotter", "Dating Safety", "Romance Scams"],
  },
  {
    id: "dr-chen-professor",
    name: "Dr. Patricia Chen",
    role: "Professor of English",
    company: "State University",
    image: "👩‍🏫",
    challenge: "Couldn't prove student cheating",
    result: "Fair, consistent AI detection",
    stats: {
      before: "40% suspected AI submissions",
      after: "Clear evidence for review board",
      fairness: "0 wrongful accusations",
    },
    story: `When ChatGPT launched, I watched my students' writing change overnight. Essays that should have taken weeks appeared in hours. The voice was different—technically correct but somehow hollow.

But I couldn't prove it. Traditional plagiarism checkers found nothing. AI detectors gave inconsistent results. I had suspicions but no evidence.

The breaking point came when a student submitted an essay that used the exact phrase "multifaceted exploration of thematic elements" three times. No human writes like that.

I started using NotARobot's essay integrity tool. Unlike other detectors, it doesn't just flag AI—it shows stylometric analysis, comparing the submission to the student's previous work.

For one case, the tool showed that a student's writing had completely changed between drafts—different vocabulary complexity, different sentence structures, different patterns entirely. With that evidence, the review board could make a fair decision.

The key word is "fair." I'm not trying to catch students—I'm trying to maintain academic integrity while protecting those who do the work honestly. This tool helps me do both.`,
    tags: ["Essay Integrity", "Academic", "Education"],
  },
  {
    id: "recruiting-agency",
    name: "TalentFirst Recruiting",
    role: "Executive Recruiting Firm",
    company: "Chicago, IL",
    image: "🏢",
    challenge: "Flooded with AI-generated applications",
    result: "70% faster screening",
    stats: {
      before: "2 hours per candidate screening",
      after: "35 minutes per candidate",
      quality: "3x better candidate quality",
    },
    story: `Our agency places C-suite executives. We used to receive maybe 50 applications per role. Now we get 500+, and at least half are clearly AI-generated garbage.

People are using ChatGPT to spray-and-pray—generating dozens of tailored cover letters and resumes, hoping something sticks. It wastes everyone's time.

We integrated NotARobot's bulk resume processing into our workflow. Now every application gets an automatic humanity score before a human ever sees it.

Applications scoring below 40% human go into a separate queue. We still review them—sometimes legitimate candidates just made poor AI-assisted choices—but it's saved us hundreds of hours.

The best part? Our clients have noticed the quality improvement. We're placing candidates faster because we're not wading through robot noise.

We've processed over 10,000 resumes through the system. The ROI was clear within the first month.`,
    tags: ["Bulk Processing", "Recruiting", "Enterprise"],
  },
];

export default function CaseStudiesPage() {
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
              Real Stories from <span className="text-accent">Real Humans</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              How people and organizations are using NotARobot to navigate the AI age.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 px-6 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-accent">10,000+</p>
            <p className="text-sm text-gray-500">Resumes Sanitized</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-400">68%</p>
            <p className="text-sm text-gray-500">Avg Response Rate Increase</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">5,000+</p>
            <p className="text-sm text-gray-500">Fake Profiles Detected</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-400">94%</p>
            <p className="text-sm text-gray-500">Customer Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {CASE_STUDIES.map((study, index) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="text-6xl">{study.image}</div>
                  <div>
                    <h3 className="font-bold text-lg">{study.name}</h3>
                    <p className="text-sm text-gray-400">{study.role}</p>
                    <p className="text-sm text-gray-500">{study.company}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Challenge</p>
                      <p className="text-sm">{study.challenge}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Result</p>
                      <p className="text-sm">{study.result}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-zinc-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="md:col-span-2">
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-zinc-800">
                    {Object.entries(study.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-lg font-bold text-accent">{value}</p>
                        <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Story Content */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    {study.story.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-300 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of humans who've taken back control from the algorithms.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services/resume">
              <Button className="bg-accent text-black hover:bg-accent/90">
                Try Resume Sanitizer
              </Button>
            </Link>
            <Link href="/game">
              <Button variant="outline">
                Play Real vs AI
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
