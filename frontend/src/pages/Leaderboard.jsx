import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Flame, BookOpen, Target, Crown } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/api/leaderboard');
        setLeaders(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <LoadingScreen />;

  const getRankStyle = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
      case 2: return 'bg-gray-300/20 text-gray-300 border-gray-300/50 shadow-[0_0_15px_rgba(209,213,219,0.2)]';
      case 3: return 'bg-amber-700/20 text-amber-600 border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.2)]';
      default: return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="font-bold text-lg">{rank}</span>;
  };

  // The Top 3 
  const topThree = leaders.slice(0, 3);
  // The rest
  const remaining = leaders.slice(3);

  return (
    <div className="min-h-screen pb-20 mt-10 md:mt-2 px-4 max-w-5xl mx-auto space-y-12">
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold tracking-wide uppercase text-sm">Hall of Fame</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 pb-2">
          Global Leaderboard
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
          See how you stack up against the best learners on LearnTrack. Earn EXP, complete courses, and maintain your streak to climb the ranks!
        </p>
      </motion.div>

      {/* Podium for Top 3 */}
      {topThree.length > 0 && (
        <div className="pt-8 pb-12 flex justify-center items-end gap-2 md:gap-6">
          {/* Rank 2 */}
          {topThree[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden shadow-lg shadow-gray-400/20">
                  {topThree[1].profilePicture ? (
                    <img src={topThree[1].profilePicture} alt={`${topThree[1].username}'s profile`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-gray-300">
                      {topThree[1].username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-zinc-900 z-10 shadow-sm">
                  2
                </div>
              </div>
              <p className="font-bold text-zinc-200 text-lg truncate max-w-[100px]">{topThree[1].username}</p>
              <div className="flex items-center gap-1 text-sm text-indigo-400 mt-1 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold">{topThree[1].exp}</span>
              </div>
              <div className="w-24 h-32 md:h-40 bg-gradient-to-t from-gray-800 to-gray-700/50 rounded-t-lg mt-4 border-t-2 border-gray-500/30 flex flex-col justify-start items-center pt-2 gap-1.5">
                <div className="flex flex-col items-center gap-1 font-semibold">
                  <div className="flex items-center gap-1 text-xs text-orange-400" title="Current Streak"><Flame className="w-3 h-3 fill-current" /> {topThree[1].streak} cur</div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500" title="Highest Streak"><Target className="w-3 h-3" /> {topThree[1].longestStreak} max</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 */}
          {topThree[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex flex-col items-center z-10"
            >
              <div className="relative mb-4">
                <Crown className="w-8 h-8 text-yellow-500 absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-yellow-500 overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  {topThree[0].profilePicture ? (
                    <img src={topThree[0].profilePicture} alt={`${topThree[0].username}'s profile`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-yellow-500">
                      {topThree[0].username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border-4 border-zinc-900 shadow-md">
                  1
                </div>
              </div>
              <p className="font-bold text-white text-xl truncate max-w-[120px]">{topThree[0].username}</p>
              <div className="flex items-center gap-1 text-sm text-yellow-400 mt-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-black">{topThree[0].exp.toLocaleString()}</span>
              </div>
              <div className="w-28 md:w-32 h-40 md:h-48 bg-gradient-to-t from-yellow-900/40 to-yellow-600/20 rounded-t-lg mt-4 border-t-2 border-yellow-500/50 flex flex-col justify-start items-center pt-4 shadow-[0_-10px_20px_rgba(234,179,8,0.1)]">
                <div className="flex flex-col items-center gap-2 w-full px-2">
                  <div className="flex flex-col items-center gap-1 font-bold text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-xl text-sm border border-orange-500/20 w-full">
                    <div className="flex items-center gap-1.5" title="Current Streak"><Flame className="w-4 h-4 fill-current" /> <span className="text-orange-200">Cur:</span> {topThree[0].streak}</div>
                    <div className="flex items-center gap-1 opacity-80 text-xs" title="Highest Streak"><Target className="w-3 h-3" /> <span className="text-orange-300">Max:</span> {topThree[0].longestStreak}</div>
                  </div>
                  <div className="text-zinc-300 text-xs font-medium flex items-center gap-1">
                     <BookOpen className="w-3 h-3 text-indigo-400" /> {topThree[0].completedPlaylists} Done
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 */}
          {topThree[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-amber-700 overflow-hidden shadow-lg shadow-amber-900/40">
                  {topThree[2].profilePicture ? (
                    <img src={topThree[2].profilePicture} alt={`${topThree[2].username}'s profile`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-amber-600">
                      {topThree[2].username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-amber-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-zinc-900 shadow-sm">
                  3
                </div>
              </div>
              <p className="font-bold text-zinc-300 text-base md:text-lg truncate max-w-[90px]">{topThree[2].username}</p>
              <div className="flex items-center gap-1 text-xs md:text-sm text-indigo-400 mt-1 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold">{topThree[2].exp}</span>
              </div>
              <div className="w-24 h-28 md:h-32 bg-gradient-to-t from-gray-900 to-amber-900/30 rounded-t-lg mt-4 border-t-2 border-amber-700/40 flex flex-col justify-start items-center pt-2 gap-1.5">
                 <div className="flex flex-col items-center gap-1 font-semibold">
                  <div className="flex items-center gap-1 text-xs text-orange-400" title="Current Streak"><Flame className="w-3 h-3 fill-current" /> {topThree[2].streak} cur</div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500" title="Highest Streak"><Target className="w-3 h-3" /> {topThree[2].longestStreak} max</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* List for the rest */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800/80 text-zinc-500 text-xs md:text-sm font-semibold tracking-wider uppercase bg-zinc-800/30">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-4 md:col-span-4">Learner</div>
          <div className="col-span-2 text-center text-orange-500/80 hidden md:block">Current Streak</div>
          <div className="col-span-2 text-center text-red-500/80 hidden md:block">Max Streak</div>
          <div className="col-span-2 text-center text-emerald-500/80 hidden md:block">Playlists Done</div>
          <div className="col-span-6 md:hidden text-right pr-4">Stats</div>
        </div>
        
        <div className="divide-y divide-zinc-800/50 max-h-[600px] overflow-y-auto custom-scrollbar">
          {remaining.map((leader, index) => {
            const rank = leader.rank;
            const isCurrentUser = user && user._id === leader._id;
            
            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={leader._id}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-zinc-800/40 ${isCurrentUser ? 'bg-indigo-900/20' : ''}`}
              >
                {/* Rank */}
                <div className="col-span-2 flex justify-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getRankStyle(rank)}`}>
                    {getRankIcon(rank)}
                  </div>
                </div>

                {/* User Info */}
                <div className="col-span-4 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                    {leader.profilePicture ? (
                      <img src={leader.profilePicture} alt={leader.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400">
                        {leader.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200 truncate flex items-center gap-2">
                      {leader.username}
                      {isCurrentUser && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">You</span>}
                    </div>
                    <div className="text-xs text-indigo-400 font-bold flex items-center gap-1">Lvl {leader.level} <span className="text-zinc-600 font-normal ml-2">| {leader.exp.toLocaleString()} EXP</span></div>
                  </div>
                </div>

                {/* Current Streak (Desktop) */}
                  <div className="col-span-2 hidden md:flex items-center justify-center gap-1.5 text-zinc-300 font-medium text-base">
                    <Flame className={`w-4 h-4 ${leader.streak > 3 ? 'text-orange-500 fill-orange-500 shadow-orange-500/50 drop-shadow-md' : 'text-zinc-500'}`} />
                    {leader.streak}
                  </div>

                  {/* Max Streak (Desktop) */}
                  <div className="col-span-2 hidden md:flex items-center justify-center gap-1.5 text-zinc-300 font-medium text-base">
                    <Target className="w-4 h-4 text-red-500/80" />
                    {leader.longestStreak}
                  </div>

                  {/* Playlists Completed (Desktop) */}
                  <div className="col-span-2 hidden md:flex items-center justify-center gap-1.5 text-zinc-300 font-medium text-base">
                    <BookOpen className="w-4 h-4 text-emerald-500/80" />
                     {leader.completedPlaylists}
                  </div>

                {/* Mobile-only Stats */}
                <div className="col-span-6 md:hidden flex flex-col items-end justify-center pr-2 gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                      <Flame className="w-3 h-3 fill-current"/> 
                      <span className="font-bold">{leader.streak}</span>
                      <span className="opacity-70 text-[10px] uppercase">Cur</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-zinc-400 font-medium">
                      <span className="flex items-center gap-1 text-red-400/80"><Target className="w-3 h-3"/> {leader.longestStreak} max</span>
                      <span className="flex items-center gap-1 text-emerald-400/80"><BookOpen className="w-3 h-3"/> {leader.completedPlaylists} done</span>
                    </div>
                </div>
              </motion.div>
            );
          })}
          
          {remaining.length === 0 && leaders.length <= 3 && (
            <div className="p-8 text-center text-zinc-500 italic">
               No other learners on the leaderboard yet. Be the first to claim a spot!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
