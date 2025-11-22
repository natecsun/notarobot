import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ImagePlus, ScanFace } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4">Fake Profile Spotter</h1>
        <p className="text-gray-500 mb-12">
          Suspicious match? Upload a screenshot of their profile or their photos. We detect GAN-generated faces and LLM-generated bios.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer flex flex-col items-center justify-center h-64">
              <ImagePlus className="w-10 h-10 mb-4 text-gray-400" />
              <p className="font-semibold">Upload Photos</p>
           </div>
           
           <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-64 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                 <p className="text-accent font-mono animate-pulse">SCANNING...</p>
              </div>
              {/* Mock profile view */}
              <div className="opacity-50 blur-sm">
                 <div className="w-20 h-20 bg-gray-700 rounded-full mb-4 mx-auto"></div>
                 <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                 <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
           </div>
        </div>

        <div className="mt-8">
           <Button className="w-full py-6 text-lg gap-2" disabled>
              <ScanFace className="w-5 h-5" /> Analyze Profile (Mock)
           </Button>
        </div>
      </div>
    </main>
  );
}
