import { createClient } from "@/utils/supabase/client";
import { CheckCircle, ShieldCheck, FileText, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const supabase = createClient();

    const { data: result } = await supabase
        .from('saved_results')
        .select('*')
        .eq('id', params.id)
        .eq('is_public', true)
        .single();

    if (!result) {
        return {
            title: "Verification Not Found - NotARobot.com",
            description: "The requested verification certificate could not be found."
        };
    }

    const { human_score, verdict } = result.result_data;
    const isVerified = human_score > 85;

    const title = isVerified
        ? `Verified Human (${human_score}%) - Certificate of Authenticity`
        : `Content Analysis Report - Score: ${human_score}%`;

    const description = isVerified
        ? `This document has been verified as human-written by NotARobot.com. View the official certificate.`
        : `Analysis Result: ${verdict}. AI Probability: ${result.result_data.ai_probability}%. View full report.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            siteName: 'NotARobot.com',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

// This is a server component by default in Next.js App Router
export default async function VerifyPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // Fetch the result
    // Note: RLS policy "Public can view shared results" must be active
    const { data: result, error } = await supabase
        .from('saved_results')
        .select('*')
        .eq('id', params.id)
        .eq('is_public', true)
        .single();

    if (error || !result) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Verification Not Found</h1>
                <p className="text-gray-500 mb-6">This certificate does not exist or has not been made public.</p>
                <Link href="/" className="text-blue-500 hover:underline">
                    Go to NotARobot.com
                </Link>
            </main>
        );
    }

    const { human_score, ai_probability, verdict } = result.result_data;
    const isVerified = human_score > 85;
    const date = new Date(result.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">

                {/* Header Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] -z-0" />

                <div className="relative z-10 p-8 md:p-12 text-center">
                    {/* Logo / Brand */}
                    <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tighter mb-12 hover:opacity-80 transition-opacity">
                        <ShieldCheck className="w-6 h-6 text-black dark:text-white" />
                        <span>NotARobot.com</span>
                    </Link>

                    {/* Badge */}
                    <div className="flex justify-center mb-8">
                        {isVerified ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full" />
                                <div className="relative w-40 h-40 bg-gradient-to-b from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-zinc-800">
                                    <CheckCircle className="w-20 h-20 text-white" />
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 px-4 py-1 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                                    <span className="font-bold text-green-600 dark:text-green-400 text-sm tracking-wider uppercase">Verified Human</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-40 h-40 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-200 dark:border-zinc-700">
                                <span className="text-4xl font-bold text-zinc-400">{human_score}%</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {isVerified ? "Certificate of Authenticity" : "Content Analysis Report"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        This document has been analyzed by NotARobot's AI detection engine and certified for authenticity.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="text-sm text-gray-500 mb-1">Human Score</div>
                            <div className={`text-2xl font-bold ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                {human_score}%
                            </div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="text-sm text-gray-500 mb-1">AI Probability</div>
                            <div className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">
                                {ai_probability}%
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-left bg-zinc-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-8">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Document
                            </span>
                            <span className="font-medium truncate max-w-[200px]">{result.original_content}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Verified On
                            </span>
                            <span className="font-medium">{date}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Verification ID
                            </span>
                            <span className="font-mono text-xs text-gray-400">{params.id}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <Link href="/">
                            <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                                Verify Another Document
                            </button>
                        </Link>
                        <p className="mt-6 text-xs text-gray-400">
                            NotARobot.com • The Human Defense Layer
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
