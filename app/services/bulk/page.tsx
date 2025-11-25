"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Trash2,
  Building2,
  Users
} from "lucide-react";

type FileStatus = "pending" | "processing" | "complete" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  humanScore?: number;
  error?: string;
}

export default function BulkResumePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(f => f.type === "application/pdf");
    const uploadedFiles: UploadedFile[] = pdfFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      size: f.size,
      status: "pending" as FileStatus,
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processAll = async () => {
    setIsProcessing(true);
    
    // Simulate processing each file
    for (const file of files) {
      if (file.status !== "pending") continue;
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: "processing" as FileStatus } : f
      ));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Random result for demo
      const success = Math.random() > 0.1;
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: success ? "complete" as FileStatus : "error" as FileStatus,
              humanScore: success ? Math.floor(Math.random() * 30) + 70 : undefined,
              error: success ? undefined : "Processing failed"
            } 
          : f
      ));
    }
    
    setIsProcessing(false);
  };

  const completedCount = files.filter(f => f.status === "complete").length;
  const avgScore = completedCount > 0 
    ? Math.round(files.filter(f => f.humanScore).reduce((acc, f) => acc + (f.humanScore || 0), 0) / completedCount)
    : 0;

  return (
    <main className="min-h-screen bg-black p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="gap-2 pl-0 mb-8 hover:bg-transparent hover:text-accent">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-mono mb-4">
            <Building2 className="w-3 h-3" /> ENTERPRISE FEATURE
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Bulk Resume Processing
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Upload multiple resumes at once. Perfect for recruiters, HR teams, and 
            anyone who needs to verify authenticity at scale.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative ${
                dragActive 
                  ? 'border-accent bg-accent/5' 
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-accent' : 'text-zinc-600'}`} />
              <h3 className="text-lg font-bold mb-2">
                {dragActive ? "Drop files here" : "Drag & drop resume PDFs"}
              </h3>
              <p className="text-sm text-gray-500">or click to browse (max 50 files)</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">{files.length} file(s) queued</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                    className="text-red-400 hover:text-red-300"
                  >
                    Clear All
                  </Button>
                </div>

                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50"
                    >
                      <FileText className="w-5 h-5 text-blue-400" />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      {file.status === "pending" && (
                        <span className="text-xs text-gray-500">Pending</span>
                      )}
                      {file.status === "processing" && (
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      )}
                      {file.status === "complete" && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-green-400 font-mono font-bold">
                            {file.humanScore}%
                          </span>
                        </div>
                      )}
                      {file.status === "error" && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}

                      {file.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  onClick={processAll}
                  disabled={isProcessing || files.filter(f => f.status === "pending").length === 0}
                  className="w-full mt-4 bg-accent text-black hover:bg-accent/90"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process All Resumes"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Batch Stats
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Files</p>
                  <p className="text-2xl font-bold">{files.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{completedCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Avg Human Score</p>
                  <p className="text-2xl font-bold text-accent">{avgScore || "—"}%</p>
                </div>
              </div>
            </div>

            {completedCount > 0 && (
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" /> Export Results
              </Button>
            )}

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
              <p className="text-xs text-gray-500 font-mono">
                [ each resume costs 1 credit. bulk discounts available for enterprise. ]
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
