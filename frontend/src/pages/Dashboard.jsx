import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Target, TrendingUp, ArrowRight, Star, Clock, Edit2, Check } from "lucide-react";
import StudyHeatmap from "../components/StudyHeatmap";
import JumpBackIn from "../components/JumpBackIn";
import MotivationQuote from "../components/MotivationQuote";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({ totalCourses: 0, completedCourses: 0 });
  const [weeklyStats, setWeeklyStats] = useState({ currentWeekMinutes: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [plResponse, statsResponse] = await Promise.all([
          api.get("/api/playlists"),
          api.get("/api/progress/stats")
        ]);
        const data = plResponse.data;
        setDashboardData({
          totalCourses: data.length,
          completedCourses: data.filter(pl => pl.percent === 100).length
        });
        setWeeklyStats(statsResponse.data);
        if (user?.weeklyGoalMinutes) {
          setGoalInput(user.weeklyGoalMinutes / 60); // Show in hours for UI input
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user?.weeklyGoalMinutes]);

  const saveWeeklyGoal = async () => {
    try {
      const minutes = Math.max(1, goalInput) * 60;
      const { data } = await api.put("/api/auth/weekly-goal", { minutes });
      setUser(prev => ({ ...prev, weeklyGoalMinutes: data.weeklyGoalMinutes }));
      setIsEditingGoal(false);
    } catch (e) {
      console.error("Failed to update goal", e);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const completionRate = dashboardData.totalCourses > 0
    ? Math.round((dashboardData.completedCourses / dashboardData.totalCourses) * 100)
    : 0;

  const currentLevel = user?.level || 1;
  const currentExp = user?.exp || 0;
  const expForNextLevel = currentLevel * 500;
  const expPercent = Math.min(100, Math.round((currentExp / expForNextLevel) * 100));

  const goalMinutes = user?.weeklyGoalMinutes || 120;
  const currentMinutes = weeklyStats.currentWeekMinutes || 0;
  const goalPercent = Math.min(100, Math.round((currentMinutes / goalMinutes) * 100));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto pb-20 px-1"
    >
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <motion.div variants={item}>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-[var(--text-muted)] mt-1.5 text-sm md:text-base">
            Welcome back — here's your learning overview.
          </p>
        </motion.div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6 md:space-y-8 min-w-0">

          {/* Continue Learning */}
          <motion.section variants={item}>
            <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Continue Learning</h2>
            <JumpBackIn />
          </motion.section>

          {/* Stats Cards */}
          <motion.section variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {/* My Courses Card */}
            <Link to="/courses" className="group">
              <div className="bg-[var(--card-bg)] border border-[var(--border)] hover:border-indigo-500/30 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-500/10 flex items-center justify-center rounded-xl text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-0.5 group-hover:text-indigo-500 transition-colors">My Courses</h3>
                <p className="text-[var(--text-muted)] text-sm">{dashboardData.totalCourses} active learning paths</p>
              </div>
            </Link>

            {/* Achievements Card */}
            <Link to="/profile" className="group">
              <div className="bg-[var(--card-bg)] border border-[var(--border)] hover:border-emerald-500/30 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-400">
                    <Trophy size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-0.5 group-hover:text-emerald-500 transition-colors">Achievements</h3>
                <p className="text-[var(--text-muted)] text-sm">{dashboardData.completedCourses} courses completed</p>
              </div>
            </Link>
          </motion.section>

          {/* Motivation Quote */}
          <motion.section variants={item}>
            <MotivationQuote />
          </motion.section>
        </div>

        {/* Sidebar */}
        <motion.div variants={item} className="xl:w-[340px] shrink-0 space-y-5">
          <div className="sticky top-24 space-y-5">
            {/* Gamification Profile */}
            <div className="bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-0.5">
                  <div className="w-full h-full bg-[#121214] rounded-full flex flex-col items-center justify-center">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold text-yellow-500 mt-0.5">Lvl {currentLevel}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[var(--text-primary)]">Learner Rank</h4>
                  <p className="text-xs text-[var(--text-muted)]">{currentExp} / {expForNextLevel} EXP</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[var(--skeleton)] rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500" style={{ width: `${expPercent}%` }} />
              </div>
              {user?.badges && user.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                  {user.badges.map((badge, idx) => (
                    <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md flex items-center gap-1">
                      <Trophy size={10} /> {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Goal */}
            <div className="bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-2.5 mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg text-blue-400">
                    <Clock size={16} />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">Weekly Goal</h4>
                </div>
                {!isEditingGoal ? (
                  <button onClick={() => setIsEditingGoal(true)} className="p-1.5 text-[var(--text-muted)] hover:text-blue-400 transition-colors">
                    <Edit2 size={14} />
                  </button>
                ) : (
                  <button onClick={saveWeeklyGoal} className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-md transition-colors">
                    <Check size={14} />
                  </button>
                )}
              </div>
              
              {isEditingGoal ? (
                <div className="mt-3 mb-2 flex items-center gap-2 relative z-10">
                  <input 
                    type="number" 
                    min="1"
                    className="w-16 bg-[var(--bg-surface)] border border-[var(--border)] rounded p-1 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                  />
                  <span className="text-sm text-[var(--text-muted)]">hours / wk</span>
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)] mb-3 relative z-10">
                  <strong className="text-[var(--text-primary)] text-sm">{Math.floor(currentMinutes / 60)}h {currentMinutes % 60}m</strong> / {goalMinutes / 60}h
                </p>
              )}

              <div className="h-2 w-full bg-[var(--skeleton)] rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${goalPercent}%` }} />
              </div>
              <p className="text-[10px] text-right mt-1 text-[var(--text-muted)] relative z-10">{goalPercent}% complete</p>
            </div>

            {/* Heatmap */}
            <StudyHeatmap />

            {/* Progress Card */}
            <div className="bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border)]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-violet-500/10 flex items-center justify-center rounded-lg text-violet-400">
                  <Target size={16} />
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">Your Progress</h4>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-[var(--skeleton)]" />
                    <circle
                      cx="28" cy="28" r="24" fill="none" stroke="url(#progressGrad)" strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={`${completionRate * 1.508} 150.8`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{completionRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-semibold">{dashboardData.completedCourses}<span className="text-[var(--text-muted)] font-normal">/{dashboardData.totalCourses}</span></p>
                  <p className="text-[var(--text-muted)] text-xs">courses completed</p>
                </div>
              </div>

              {/* Encouragement */}
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] p-2.5 rounded-xl border border-[var(--border-light)]">
                <TrendingUp size={13} className="text-emerald-400 shrink-0" />
                <span>Keep going — every lesson counts!</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
