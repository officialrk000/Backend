import React from 'react';
import { Search, Sparkles, TrendingUp, Bell } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  return (
    <div className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Real-time Government Job Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]"
        >
          Your Gateway to <br />
          <span className="text-blue-600">Sarkari Careers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Get instant notifications for SSC, UPSC, Railways, Banking, and State Govt exams. 
          The most trusted portal for 10M+ aspirants.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto relative group mb-12"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white rounded-[2rem] shadow-xl border border-gray-100 flex items-center p-2">
            <div className="flex-1 flex items-center px-6">
              <Search className="w-5 h-5 text-gray-400 mr-4" />
              <input
                type="text"
                placeholder="Search jobs, results, or exam names..."
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 py-4 text-lg"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <button className="hidden md:flex bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              Search Now
            </button>
          </div>
        </motion.div>

        {/* Quick Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <span className="text-sm font-semibold text-gray-400 w-full mb-2 uppercase tracking-widest">Trending Categories</span>
          {[
            { label: 'UPSC Exams', icon: TrendingUp },
            { label: 'SSC CGL', icon: TrendingUp },
            { label: 'Railways (RRB)', icon: TrendingUp },
            { label: 'Banking', icon: TrendingUp },
            { label: 'State PCS', icon: TrendingUp },
          ].map((cat, i) => (
            <button
              key={i}
              className="px-5 py-2.5 rounded-full bg-white border border-gray-100 text-sm font-semibold text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all shadow-sm"
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
