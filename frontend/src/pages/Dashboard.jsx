import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Target, TrendingUp, ArrowRight } from "lucide-react";
import StudyHeatmap from "../components/StudyHeatmap";
import JumpBackIn from "../components/JumpBackIn";
import MotivationQuote from "../components/MotivationQuote";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({ totalCourses: 0, completedCourses: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [response] = await Promise.all([
          api.get("/api/playlists"),
          new Promise(resolve => setTimeout(resolve, 800))
        ]);
        const data = response.data;
        setDashboardData({
          totalCourses: data.length,
          completedCourses: data.filter(pl => pl.percent === 100).length
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const completionRate = dashboardData.totalCourses > 0
    ? Math.round((dashboardData.completedCourses / dashboardData.totalCourses) * 100)
    : 0;

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
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-500 mt-1.5 text-sm md:text-base">
            Welcome back — here's your learning overview.
          </p>
        </motion.div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6 md:space-y-8 min-w-0">

          {/* Continue Learning */}
          <motion.section variants={item}>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Continue Learning</h2>
            <JumpBackIn />
          </motion.section>

          {/* Stats Cards — clean, distinct colors */}
          <motion.section variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {/* My Courses Card */}
            <Link to="/courses" className="group">
              <div className="bg-surface/60 border border-white/[0.06] hover:border-indigo-500/30 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:bg-surface/80">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-500/10 flex items-center justify-center rounded-xl text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-0.5 group-hover:text-indigo-400 transition-colors">My Courses</h3>
                <p className="text-zinc-500 text-sm">{dashboardData.totalCourses} active learning paths</p>
              </div>
            </Link>

            {/* Achievements Card */}
            <Link to="/profile" className="group">
              <div className="bg-surface/60 border border-white/[0.06] hover:border-emerald-500/30 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:bg-surface/80">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-400">
                    <Trophy size={20} />
                  </div>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">Achievements</h3>
                <p className="text-zinc-500 text-sm">{dashboardData.completedCourses} courses completed</p>
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
            {/* Heatmap */}
            <StudyHeatmap />

            {/* Progress Card */}
            <div className="bg-surface/60 p-5 rounded-2xl border border-white/[0.06]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-violet-500/10 flex items-center justify-center rounded-lg text-violet-400">
                  <Target size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white">Your Progress</h4>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-white/[0.05]" />
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
                    <span className="text-xs font-bold text-white">{completionRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-semibold">{dashboardData.completedCourses}<span className="text-zinc-500 font-normal">/{dashboardData.totalCourses}</span></p>
                  <p className="text-zinc-500 text-xs">courses completed</p>
                </div>
              </div>

              {/* Encouragement */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
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
