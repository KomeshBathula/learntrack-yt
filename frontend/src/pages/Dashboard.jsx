import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { Plus, PlayCircle, Clock, Zap, BarChart2, Search, ArrowRight, LayoutGrid, List } from "lucide-react";
import StudyHeatmap from "../components/StudyHeatmap";
import JumpBackIn from "../components/JumpBackIn";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchPlaylists = async () => {
    try {
      const { data } = await api.get("/api/playlists");
      setPlaylists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddPlaylist = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/playlists", { url: newUrl });
      setNewUrl("");
      fetchPlaylists();
    } catch (error) {
      alert(
        "Error adding playlist: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-zinc-400 mt-2">Welcome back to your learning command center</p>
        </motion.div>

        {/* Floating Import Bar */}
        <motion.form
          variants={item}
          onSubmit={handleAddPlaylist}
          className="w-full md:w-[600px] relative group z-20"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg"></div>
          <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 pl-4 transition-all focus-within:border-primary/50 focus-within:bg-black/80">
            <Search className="text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Paste YouTube Playlist URL..."
              className="flex-1 bg-transparent border-none focus:outline-none text-white px-4 py-2 placeholder:text-zinc-600"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-zinc-800 hover:bg-white text-white hover:text-black font-medium py-2 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Import <Plus size={16} /></>
              )}
            </button>
          </div>
        </motion.form>
      </header>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-10 min-w-0">

          {/* 1. Feature: Jump Back In */}
          <motion.section variants={item}>
            <JumpBackIn />
          </motion.section>

          {/* 2. Content Grid */}
          <motion.section variants={item} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid size={20} className="text-primary" />
                My Learning Paths
              </h2>
              <div className="flex gap-2 text-sm text-zinc-500">
                <span>{playlists.length} Courses</span>
              </div>
            </div>

            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {playlists.map((pl) => (
                  <Link
                    to={`/playlist/${pl._id}`}
                    key={pl._id}
                    className="group flex flex-col"
                  >
                    <div className="bg-surface/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1 relative">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                        {pl.thumbnail ? (
                          <img
                            src={pl.thumbnail}
                            alt={pl.title}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-700">
                            <PlayCircle size={48} />
                          </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                        {/* Floating Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white shadow-xl">
                            <PlayCircle size={24} fill="currentColor" />
                          </div>
                        </div>

                        {/* Progress Badge */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <span className="text-xs font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5">
                            {pl.videoCount} Videos
                          </span>
                          {pl.percent === 100 && (
                            <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/20">
                              COMPLETED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col gap-3">
                        <div>
                          <h3 className="font-bold text-lg leading-tight text-zinc-100 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {pl.title}
                          </h3>
                          <p className="text-xs font-medium text-zinc-500">{pl.channelTitle}</p>
                        </div>

                        <div className="mt-auto space-y-3">
                          {/* Custom Progress Bar */}
                          <div className="bg-white/5 rounded-full h-1.5 w-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${pl.percent === 100 ? 'bg-green-500' : 'bg-primary'}`}
                              style={{ width: `${pl.percent}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-xs text-zinc-500 font-medium">
                            <div className="flex items-center gap-1.5">
                              <BarChart2 size={12} />
                              {pl.percent}%
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} />
                              {Math.floor(pl.totalDurationSeconds / 3600)}h {Math.floor((pl.totalDurationSeconds % 3600) / 60)}m
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              !fetching && (
                <div className="py-20 flex flex-col items-center justify-center text-center border border-white/5 border-dashed rounded-3xl bg-white/[0.02]">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <Plus className="text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Start Your Journey</h3>
                  <p className="text-zinc-500 max-w-sm">Import a YouTube playlist above to begin tracking your progress.</p>
                </div>
              )
            )}
          </motion.section>
        </div>

        {/* Sidebar: Heatmap */}
        <motion.div variants={item} className="xl:w-[350px] shrink-0 space-y-6">
          <div className="sticky top-24">
            <StudyHeatmap />

            {/* Mini Motivation Card */}
            <div className="mt-6 bg-gradient-to-br from-primary/10 to-transparent p-5 rounded-3xl border border-primary/20 relative overflow-hidden">
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Daily Tip</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Consistency beats intensity. 20 minutes a day is better than 5 hours once a week.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
