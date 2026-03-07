import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-20 px-1 animate-fade-in">
            {/* Header */}
            <header className="mb-8 md:mb-10">
                <div className="space-y-2 w-full max-w-md">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-5 w-72" />
                </div>
            </header>

            <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
                <div className="flex-1 space-y-6 md:space-y-8 min-w-0">

                    {/* Continue Learning Section */}
                    <section>
                        <Skeleton className="h-4 w-36 mb-4 rounded" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card-bg)] h-[260px] md:h-[300px] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                            <Skeleton className="w-full md:w-80 h-44 md:h-full rounded-xl shrink-0" />
                            <div className="flex-1 w-full space-y-4 py-2">
                                <Skeleton className="h-4 w-28 rounded-full" />
                                <Skeleton className="h-7 w-full" />
                                <Skeleton className="h-7 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="pt-3">
                                    <Skeleton className="h-11 w-44 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-[var(--card-bg)] border border-[var(--border)] p-5 md:p-6 rounded-2xl flex flex-col justify-between h-[160px]">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="w-10 h-10 rounded-xl" />
                                    <Skeleton className="w-4 h-4 rounded" />
                                </div>
                                <div className="space-y-1.5">
                                    <Skeleton className="h-6 w-28" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Motivation Quote Skeleton */}
                    <section>
                        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/10 via-white/5 to-white/10 rounded-l-2xl animate-pulse" />
                            <div className="px-6 py-5 md:px-7 md:py-5 pl-7 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-4 h-4 rounded" />
                                    <Skeleton className="h-3 w-24 rounded" />
                                </div>
                                <Skeleton className="h-[18px] w-[90%] rounded" />
                                <Skeleton className="h-[18px] w-[60%] rounded" />
                                <Skeleton className="h-3 w-[30%] rounded mt-1" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="xl:w-[340px] shrink-0 space-y-5">
                    <div className="sticky top-24 space-y-5">
                        {/* Heatmap Skeleton */}
                        <div className="bg-[var(--card-bg)] backdrop-blur-xl p-5 rounded-[2rem] border border-[var(--border)] h-[350px]">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-3">
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                    <div className="space-y-1">
                                        <Skeleton className="w-20 h-4" />
                                        <Skeleton className="w-12 h-3" />
                                    </div>
                                </div>
                                <Skeleton className="w-24 h-8 rounded-lg" />
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <Skeleton key={i} className="w-8 h-8 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Your Progress Skeleton */}
                        <div className="bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border)]">
                            <div className="flex items-center gap-2.5 mb-4">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="h-4 w-24 rounded" />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <Skeleton className="w-14 h-14 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-5 w-16 rounded" />
                                    <Skeleton className="h-3 w-24 rounded" />
                                </div>
                            </div>
                            <Skeleton className="h-9 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
