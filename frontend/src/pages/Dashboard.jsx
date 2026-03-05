import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { Zap, LayoutGrid, ArrowRight, Target, TrendingUp } from "lucide-react";
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
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <motion.div variants={item}>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">Good day! Ready to learn something new?</p>
        </motion.div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-10 min-w-0">

          {/* 1. Feature: Jump Back In */}
          <motion.section variants={item}>
            <h2 className="text-xl font-bold text-white mb-6">Continue Learning</h2>
            <JumpBackIn />
          </motion.section>

          {/* Quick Links / Stats */}
          <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/courses" className="group">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 hover:border-primary/50 p-6 rounded-3xl transition-all hover:bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/20 text-primary rounded-xl">
                    <LayoutGrid size={24} />
                  </div>
                  <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">My Courses</h3>
                <p className="text-zinc-400 text-sm">Access your {dashboardData.totalCourses} active learning paths</p>
              </div>
            </Link>

            <Link to="/profile" className="group">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/5 hover:border-green-500/50 p-6 rounded-3xl transition-all hover:bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                    <Zap size={24} />
                  </div>
                  <ArrowRight className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">Achievements</h3>
                <p className="text-zinc-400 text-sm">{dashboardData.completedCourses} courses completed so far</p>
              </div>
            </Link>
          </motion.section>

          {/* Motivation Quote Section */}
          <motion.section variants={item}>
            <MotivationQuote />
          </motion.section>
        </div>

        {/* Sidebar: Heatmap + Progress */}
        <motion.div variants={item} className="xl:w-[350px] shrink-0 space-y-6">
          <div className="sticky top-24">
            <StudyHeatmap />

            {/* Learning Progress Card */}
            <div className="mt-6 bg-gradient-to-br from-zinc-900/80 to-black/60 p-6 rounded-[2rem] border border-white/[0.06] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-amber-500/15 to-orange-500/15 rounded-xl text-amber-400 border border-amber-500/10">
                    <Target size={18} />
                  </div>
                  <h4 className="font-bold text-white tracking-tight">Your Progress</h4>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center gap-5 mb-5">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/[0.04]" />
                      <circle
                        cx="32" cy="32" r="28" fill="none" stroke="url(#progressGradient)" strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${completionRate * 1.76} 176`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{completionRate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{dashboardData.completedCourses}/{dashboardData.totalCourses}</p>
                    <p className="text-zinc-500 text-xs">courses completed</p>
                  </div>
                </div>

                {/* Quick Stat */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                  <TrendingUp size={14} className="text-green-400" />
                  <span>Keep going! Every step counts toward your goal.</span>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
