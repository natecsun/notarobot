import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Upload, FileText } from "lucide-react";

export default function ResumePage() {
  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4">Resume Sanitizer</h1>
        <p className="text-gray-500 mb-12">
          Upload your resume PDF. We will analyze the text patterns, sentence structures, and vocabulary to detect "AI-speak" and suggest more human alternatives.
        </p>

        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-12 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer">
           <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
           <h3 className="text-xl font-semibold mb-2">Drop your resume here</h3>
           <p className="text-sm text-gray-500 mb-6">Supports PDF, DOCX (Max 5MB)</p>
           <Button>Select File</Button>
        </div>

        <div className="mt-12 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
           <h3 className="font-bold flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-accent" /> Sample Output
           </h3>
           <div className="space-y-4 text-sm">
              <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                 <p className="text-red-400 line-through mb-1">"I am a highly motivated individual with a plethora of experience in leveraging synergies..."</p>
                 <p className="text-xs text-red-500 uppercase font-bold">AI Probability: 98%</p>
              </div>
              <div className="flex justify-center">
                 <span className="text-gray-500 text-xs">REPLACED WITH</span>
              </div>
              <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                 <p className="text-green-400">"I have 5 years of experience leading cross-functional teams to improve workflow efficiency..."</p>
                 <p className="text-xs text-green-500 uppercase font-bold">Human Score: 100%</p>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
