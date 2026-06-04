import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

interface LeaderboardEntry {
  id: number;
  github_username: string;
  merged_prs: number;
  members: {
    name: string;
  } | null;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select(`
            id,
            github_username,
            merged_prs,
            members (
              name
            )
          `)
          .order('merged_prs', { ascending: false });

        if (error) {
          console.error('Error fetching leaderboard:', error);
          return;
        }

        if (data) {
          // Supabase types can be tricky with joins, we cast it
          setLeaderboard(data as unknown as LeaderboardEntry[]);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-12 max-w-3xl mx-auto">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Contributions Yet</h3>
        <p className="text-gray-500">The leaderboard is empty. Be the first to get a PR merged!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Top Contributors 🏆
        </h2>
        <p className="text-gray-500 mt-2">Ranked by Merged Pull Requests</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {leaderboard.map((entry, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={entry.id} 
            className={`flex items-center p-4 sm:p-6 transition-colors hover:bg-gray-50 ${index !== leaderboard.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex-shrink-0 w-8 sm:w-12 text-center">
              <span className={`text-xl sm:text-2xl font-bold ${
                index === 0 ? 'text-yellow-500' : 
                index === 1 ? 'text-gray-400' : 
                index === 2 ? 'text-amber-600' : 'text-gray-300'
              }`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
            </div>
            
            <div className="ml-4 flex-grow min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {entry.members?.name || 'Unknown Member'}
              </h3>
              <p className="text-sm text-gray-500 truncate">@{entry.github_username}</p>
            </div>

            <div className="ml-4 text-right">
              <div className="text-2xl font-black text-blue-600">
                {entry.merged_prs}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                PRs
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
