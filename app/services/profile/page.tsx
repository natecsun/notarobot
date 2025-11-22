"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ImagePlus, ScanFace, Loader2, AlertTriangle, Check, X } from "lucide-react";

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ fake_probability: number; verdict: string; analysis: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Ensure analysis is an array if the LLM returns a string by mistake
        if (typeof data.analysis === 'string') {
            data.analysis = [data.analysis];
        }
        setResult(data);
      } else {
        alert("Error analyzing profile: " + data.error);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-24 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05]">
      <div className="max-w-4xl mx-auto">
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
           {/* Upload Area */}
           <div>
               <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black/50 p-2" />
                  ) : (
                    <>
                        <ImagePlus className="w-10 h-10 mb-4 text-gray-400" />
                        <p className="font-semibold">Upload Photos or Screenshot</p>
                        <p className="text-xs text-gray-500 mt-2">Max 4MB</p>
                    </>
                  )}
               </div>
               
               {file && (
                  <div className="mt-4">
                     <Button 
                        onClick={handleAnalyze} 
                        disabled={isUploading} 
                        className="w-full py-6 text-lg gap-2"
                     >
                        {isUploading ? (
                           <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Scanning Pixels...
                           </>
                        ) : (
                           <>
                              <ScanFace className="w-5 h-5" /> Analyze Profile
                           </>
                        )}
                     </Button>
                  </div>
               )}
           </div>
           
           {/* Result Area */}
           <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 min-h-[300px]">
              {result ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 h-full flex flex-col">
                      <div className={`text-center p-4 rounded-lg mb-6 border ${
                          result.fake_probability > 70 ? 'bg-red-500/10 border-red-500 text-red-500' : 
                          result.fake_probability < 30 ? 'bg-green-500/10 border-green-500 text-green-500' : 
                          'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                      }`}>
                          <h2 className="text-3xl font-bold mb-1">{result.verdict}</h2>
                          <p className="font-mono text-sm">FAKE PROBABILITY: {result.fake_probability}%</p>
                      </div>

                      <div className="flex-grow">
                          <h3 className="font-bold text-gray-400 mb-4 flex items-center gap-2">
                              <ScanFace className="w-4 h-4" /> DETECTED SIGNALS
                          </h3>
                          <ul className="space-y-3">
                              {Array.isArray(result.analysis) && result.analysis.map((point, i) => (
                                  <li key={i} className="flex gap-3 text-sm bg-black/20 p-3 rounded">
                                      <AlertTriangle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                      {point}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                      <div className="relative">
                          <ScanFace className="w-24 h-24 mb-4" />
                          <div className="absolute inset-0 border-t-2 border-accent animate-[scan_2s_ease-in-out_infinite]"></div>
                      </div>
                      <p>Waiting for image...</p>
                  </div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}
