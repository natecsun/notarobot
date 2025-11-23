import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    FileText,
    User,
    FileCheck,
    ArrowRight,
    Calendar,
    CheckCircle,
    AlertTriangle,
    XCircle
} from "lucide-react";

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: results, error } = await supabase
        .from('saved_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching results:", error);
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'resume': return <FileText className="w-5 h-5 text-blue-400" />;
            case 'profile': return <User className="w-5 h-5 text-purple-400" />;
            case 'essay': return <FileCheck className="w-5 h-5 text-green-400" />;
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    const getVerdictBadge = (result: any) => {
        // Handle different result structures
        const data = result.result_data || {};
        const score = data.human_score;
        const verdict = data.verdict || result.analyzed_content?.verdict;

        if (score !== undefined) {
            if (score > 85) return <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle className="w-3 h-3" /> Verified Human</span>;
            if (score > 50) return <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><AlertTriangle className="w-3 h-3" /> Mixed</span>;
            return <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><XCircle className="w-3 h-3" /> AI Detected</span>;
        }

        // Fallback for older records
        return <span className="text-gray-400 text-xs">{verdict || 'Analyzed'}</span>;
    };

    return (
        <main className="min-h-screen p-4 md:p-12 bg-black">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user.email}</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">New Analysis</Button>
                    </Link>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                    </div>

                    {!results || results.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="mb-4">No analysis history found.</p>
                            <Link href="/">
                                <Button>Start your first scan</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {results.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-zinc-800/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-black rounded-lg border border-zinc-800">
                                            {getIcon(item.service_type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold capitalize">{item.service_type} Check</span>
                                                {getVerdictBadge(item)}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                                <span>ID: {item.id.slice(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {item.result_data?.human_score !== undefined && (
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">Score</div>
                                                <div className={`text-xl font-bold ${item.result_data.human_score > 80 ? 'text-green-500' : 'text-zinc-300'}`}>
                                                    {item.result_data.human_score}%
                                                </div>
                                            </div>
                                        )}
                                        <Link href={`/verify/${item.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2 group-hover:bg-white group-hover:text-black">
                                                View Certificate <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
