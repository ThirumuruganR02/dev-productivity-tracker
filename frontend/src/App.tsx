import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Clock, Code, GitCommit, Zap, TrendingUp, Star } from 'lucide-react';

const API = 'http://localhost:5000/api';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

interface Stats {
  totalHours: string;
  totalSessions: number;
  topLanguage: string;
  topHour: string;
}

interface GithubStats {
  username: string;
  publicRepos: number;
  followers: number;
  topLanguages: Record<string, number>;
}

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [github, setGithub] = useState<GithubStats | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ language: 'JavaScript', duration: 60 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, githubRes] = await Promise.all([
        axios.get(`${API}/sessions/stats`),
        axios.get(`${API}/github/stats`)
      ]);
      setStats(statsRes.data);
      setGithub(githubRes.data);

      // AI Suggestions based on stats
      const s = statsRes.data;
      const tips = [
        `⏰ You code best at ${s.topHour} — block this time daily!`,
        `💻 Top language: ${s.topLanguage} — you're building real expertise!`,
        `📊 ${s.totalSessions} sessions logged — consistency is your superpower!`,
        `🔥 Keep pushing — every commit counts on your resume!`
      ];
      setSuggestions(tips);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logSession = async () => {
    try {
      await axios.post(`${API}/sessions`, {
        language: form.language,
        duration: form.duration,
        project: 'dev-productivity-tracker'
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const langData = github
    ? Object.entries(github.topLanguages).map(([name, count]) => ({ name, count }))
    : [];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-indigo-400 text-2xl animate-pulse">
        🚀 Loading your productivity data...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-400">
          🚀 Dev Productivity Tracker
        </h1>
        <p className="text-gray-400 mt-1">
          Welcome back, <span className="text-white font-semibold">@{github?.username}</span>! Here's your coding analysis.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Clock size={20}/>, label: 'Total Hours', value: stats?.totalHours + 'h', color: 'text-indigo-400' },
          { icon: <Code size={20}/>, label: 'Top Language', value: stats?.topLanguage, color: 'text-purple-400' },
          { icon: <Zap size={20}/>, label: 'Best Hour', value: stats?.topHour, color: 'text-pink-400' },
          { icon: <GitCommit size={20}/>, label: 'Sessions', value: stats?.totalSessions, color: 'text-teal-400' },
        ].map((card, i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className={`${card.color} mb-2`}>{card.icon}</div>
            <div className="text-gray-400 text-sm">{card.label}</div>
            <div className="text-2xl font-bold mt-1">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Language Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400"/> Language Breakdown
          </h2>
          {langData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={langData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name}) => name}>
                  {langData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-500 text-center py-12">
              Push repos to GitHub to see language breakdown!
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-400"/> AI Suggestions
          </h2>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Session */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Code size={18} className="text-indigo-400"/> Log Coding Session
        </h2>
        <div className="flex gap-4 flex-wrap">
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            value={form.language}
            onChange={e => setForm({...form, language: e.target.value})}
          >
            {['JavaScript','TypeScript','Python','Java','React','Node.js'].map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Duration (minutes)"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-48"
            value={form.duration}
            onChange={e => setForm({...form, duration: Number(e.target.value)})}
          />
          <button
            onClick={logSession}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {submitted ? '✅ Logged!' : '+ Log Session'}
          </button>
        </div>
      </div>
    </div>
  );
}
