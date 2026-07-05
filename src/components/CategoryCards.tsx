import React from 'react';
import { 
  GraduationCap, Users, FileText, ClipboardCheck, 
  HelpCircle, BookOpen, Newspaper, Key, ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  { 
    title: 'NTA CUET UG', 
    subtitle: 'Result 2026', 
    icon: GraduationCap, 
    color: 'bg-[#10b981]', // Emerald
    shadow: 'shadow-emerald-200'
  },
  { 
    title: 'HSSC Group D CET', 
    subtitle: 'Apply Online', 
    icon: Users, 
    color: 'bg-[#3b82f6]', // Blue
    shadow: 'shadow-blue-200'
  },
  { 
    title: 'RPSC RAS 2026', 
    subtitle: 'Apply Online', 
    icon: Newspaper, 
    color: 'bg-[#f59e0b]', // Amber/Orange
    shadow: 'shadow-amber-200'
  },
  { 
    title: 'UPTET 2026', 
    subtitle: 'Exam City Details', 
    icon: BookOpen, 
    color: 'bg-[#8b5cf6]', // Violet
    shadow: 'shadow-violet-200'
  },
  { 
    title: 'RSSB 10+2 CET', 
    subtitle: 'Apply Online', 
    icon: FileText, 
    color: 'bg-[#ef4444]', // Red
    shadow: 'shadow-red-200'
  },
  { 
    title: 'UPSRLM Various Post', 
    subtitle: 'Apply Online', 
    icon: GraduationCap, 
    color: 'bg-[#22c55e]', // Green
    shadow: 'shadow-green-200'
  },
  { 
    title: 'UPPSC Pre 2026', 
    subtitle: 'Apply Online', 
    icon: ClipboardCheck, 
    color: 'bg-[#ec4899]', // Pink
    shadow: 'shadow-pink-200'
  },
  { 
    title: 'UP Police Constable', 
    subtitle: 'Answer Key', 
    icon: Key, 
    color: 'bg-[#3b82f6]', // Blue
    shadow: 'shadow-blue-200'
  },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
            className={`relative ${cat.color} rounded-xl p-5 text-white flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform shadow-lg ${cat.shadow}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold leading-tight">{cat.title}</h3>
                <p className="text-[11px] font-medium opacity-90 mt-0.5">{cat.subtitle}</p>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
