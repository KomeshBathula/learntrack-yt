import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  differenceInCalendarDays,
  parseISO,
  isFuture,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../utils/api";

const StudyHeatmap = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activity, setActivity] = useState([]);


  const fetchActivity = async () => {

    try {
      const { data } = await api.get("/api/progress/heatmap");
      setActivity(data);
    } catch (error) {
      console.error("Failed to fetch activity", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivity();
  }, []);

  const calculateStreaks = (activity) => {
    if (activity.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedActivity = activity
      .map((a) => ({ ...a, date: parseISO(a.date) }))
      .sort((a, b) => a.date - b.date);

    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedActivity.length; i++) {
      if (i > 0) {
        const diff = differenceInCalendarDays(
          sortedActivity[i].date,
          sortedActivity[i - 1].date
        );
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const today = new Date();
    const lastActivityDate = sortedActivity[sortedActivity.length - 1].date;
    const diffFromToday = differenceInCalendarDays(today, lastActivityDate);

    if (diffFromToday <= 1) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }

    return { currentStreak, longestStreak };
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (

      <div className="flex justify-between items-center mb-4 gap-2">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-base font-bold text-white tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    return (
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-zinc-500 mb-2">
        {daysOfWeek.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const activityOnDay = activity.find((a) =>
            isSameDay(parseISO(a.date), day)
          );
          const count = activityOnDay ? activityOnDay.count : 0;

          return (
            <div
              key={day}
              className={`aspect-square w-full rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-300 ${!isSameMonth(day, monthStart)
                ? "bg-transparent text-transparent"
                : count > 0
                  ? "bg-green-500/20 text-green-400 shadow-[0_0_12px_-3px_rgba(74,222,128,0.3)] border border-green-500/30"
                  : "bg-white/5 text-zinc-500 hover:bg-white/10"
                }`}
            >
              {isSameMonth(day, monthStart) ? (
                isFuture(day) ? (
                  ""
                ) : count > 0 ? (
                  count
                ) : (
                  <span className="text-base opacity-40 grayscale hover:grayscale-0 transition-all">😭</span>
                )
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStreak = () => {
    const { currentStreak, longestStreak } = calculateStreaks(activity);

    return (
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-center items-center gap-8">
        <div className="text-center group">
          <p className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{currentStreak}</p>
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-1">Current Streak</p>
        </div>
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="text-center group">
          <p className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">{longestStreak}</p>
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-1">Longest Streak</p>
        </div>
      </div>

    );
  };

  return (
    <div className="bg-surface/50 backdrop-blur-sm p-5 rounded-3xl border border-white/10 w-full max-w-[300px] mx-auto shadow-2xl">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderStreak()}
    </div>
  );
};

export default StudyHeatmap;
