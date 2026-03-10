import { useState, useEffect } from "react";
import API from "../services/api";
import {
    Users, MessageSquare, ShieldCheck, Activity,
    Trash2, UserPlus, Clock, Search, ChevronRight, Loader2, AlertCircle,
    Zap, TrendingUp, BarChart3
} from "lucide-react";
import AdminAnalytics from "../components/AdminAnalytics";

export default function AdminControl() {
    const [stats, setStats] = useState({ total_users: 0, total_feedback: 0, total_checks: 0 });
    const [users, setUsers] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const [statsRes, usersRes, feedbackRes, activityRes] = await Promise.all([
                    API.get("/admin/stats"),
                    API.get("/admin/users"),
                    API.get("/admin/feedback"),
                    API.get("/admin/activity")
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setFeedback(feedbackRes.data);
                setActivities(activityRes.data);
                setError(null);
            } catch (err) {
                console.error("Admin fetch error:", err);
                setError(err.response?.data?.error || "Failed to load administrative data");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin text-gold mx-auto" size={48} />
                    <p className="text-gray-400 animate-pulse font-medium">Securing connection to administrative core...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-[40px] max-w-xl">
                    <AlertCircle className="text-red-500 mx-auto mb-6" size={64} />
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Access Restricted</h2>
                    <p className="text-gray-400 mb-8">{error}</p>
                    <button onClick={() => window.location.href = '/'} className="btn-gold px-10 py-4 rounded-xl">Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            System Control Panel
                        </div>
                        <h1 className="text-5xl font-serif font-bold">Admin <span className="text-gold">Control</span></h1>
                    </div>

                    <div className="flex bg-dark-surface border border-white/10 p-1.5 rounded-2xl">
                        {["overview", "users", "feedback", "activities"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? "bg-gold text-dark shadow-lg shadow-gold/20" : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Total Members", value: stats.total_users, icon: <Users />, color: "gold", trend: "+12%" },
                                { title: "Job Analysis Logs", value: stats.total_checks, icon: <BarChart3 />, color: "gold", trend: "+24%" },
                                { title: "Feedback Entries", value: stats.total_feedback, icon: <MessageSquare />, color: "gold", trend: "Stable" },
                                { title: "System Uptime", value: "99.9%", icon: <Zap />, color: "gold", trend: "Perfect" }
                            ].map((s, i) => (
                                <div key={i} className="bg-dark-surface border border-white/10 p-8 rounded-[32px] hover:border-gold/30 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {s.icon}
                                    </div>
                                    <div className="bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl text-gold mb-6 group-hover:bg-gold group-hover:text-dark transition-all">
                                        {s.icon}
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">{s.title}</p>
                                    <div className="flex items-baseline gap-3">
                                        <h3 className="text-3xl font-serif font-bold">{s.value}</h3>
                                        <span className="text-[10px] text-green-500 font-bold">{s.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Enhanced Analytics Section */}
                        <AdminAnalytics activities={activities} />

                        {/* Secondary Graphical Section */}
                        <div className="bg-dark-surface border border-white/10 p-10 rounded-[48px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1">
                                    <h3 className="text-3xl font-serif font-bold mb-4">Administrative <span className="text-gold">Intelligence</span></h3>
                                    <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-lg">
                                        System-wide analytics are processed in real-time. Every job check and user interaction is indexed to provide deep insights into platform health and security.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button onClick={() => setActiveTab("activities")} className="btn-gold !px-8 !py-4 rounded-2xl flex items-center gap-2">
                                            Audit Logs <ChevronRight size={18} />
                                        </button>
                                        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                            <TrendingUp className="text-gold" size={20} />
                                            <span className="text-sm font-bold text-white">Market Connectivity: High</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-4xl font-serif font-bold text-gold mb-2">98.2%</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Accuracy</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-4xl font-serif font-bold text-white mb-2">1.2s</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">API Latency</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="bg-dark-surface border border-white/10 rounded-[40px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-2xl font-serif font-bold">User Directory</h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input type="text" placeholder="Filter users..." className="bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-gold/50" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-8 py-6">Identity</th>
                                        <th className="px-8 py-6">Username</th>
                                        <th className="px-8 py-6">Privileges</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((u, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">{u.fullname?.[0] || u.username[0]}</div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-gold transition-colors">{u.fullname || u.username}</div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-gray-400 font-medium">@{u.username}</td>
                                            <td className="px-8 py-6">
                                                {u.is_admin ? (
                                                    <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Administrator</span>
                                                ) : (
                                                    <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Verified Member</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "feedback" && (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {feedback.map((f, i) => (
                            <div key={i} className="bg-dark-surface border border-white/10 p-8 rounded-[32px] hover:border-gold/30 transition-all flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-white/5 rounded-full shrink-0 flex items-center justify-center text-2xl text-gold font-serif font-bold border border-white/5 shadow-inner">
                                    {f.name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
                                        <div>
                                            <h4 className="text-xl font-bold mb-1">{f.subject}</h4>
                                            <p className="text-sm font-medium text-gold">{f.name} <span className="text-gray-500 mx-2">•</span> {f.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                            <Clock size={14} /> {f.created_at}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed font-medium italic">"{f.message}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "activities" && (
                    <div className="bg-dark-surface border border-white/10 rounded-[40px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-2xl font-serif font-bold">Activity Audit Log</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-8 py-6">User</th>
                                        <th className="px-8 py-6">Job Description</th>
                                        <th className="px-8 py-6">Result</th>
                                        <th className="px-8 py-6">Confidence</th>
                                        <th className="px-8 py-6">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {activities.map((act, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-gold font-bold">@{act.username}</span>
                                            </td>
                                            <td className="px-8 py-6 max-w-xs">
                                                <p className="text-xs text-gray-400 line-clamp-2 italic">"{act.description}"</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${act.result === "Real Job" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {act.result}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-white">{act.confidence}</td>
                                            <td className="px-8 py-6 text-xs text-gray-500">{act.timestamp}</td>
                                        </tr>
                                    ))}
                                    {activities.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-gray-500 italic">No job analysis activity recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
