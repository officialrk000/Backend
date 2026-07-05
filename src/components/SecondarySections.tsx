import React from 'react';
import { Job } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Zap, GraduationCap, FileText, HelpCircle,
  Tag, RefreshCw, ShieldCheck, MousePointer2, Moon
} from 'lucide-react';

interface SecondarySectionsProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
}

const ListCard = ({ title, items, icon: Icon, color }: { title: string, items: Job[], icon: any, color: string }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-0.5">
        {items.length === 0 ? (
          <p className="text-gray-400 text-[11px] py-4 text-center font-medium">No recent updates</p>
        ) : (
          items.slice(0, 5).map((job) => (
            <button 
              key={job.id} 
              onClick={() => navigate(`/post/${encodeURIComponent(job.category)}/${job.id}`)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl group transition-all text-left"
            >
              <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600 truncate mr-2">
                {job.title}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-all flex-shrink-0" />
            </button>
          ))
        )}
      </div>
      <button className="w-full mt-4 py-2 text-[11px] font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
        View All
      </button>
    </div>
  );
};

export default function SecondarySections({ jobs }: SecondarySectionsProps) {
  const syllabus = jobs.filter(j => j.category === 'Syllabus');
  const answerKeys = jobs.filter(j => j.category === 'Answer Key');
  const admissions = jobs.filter(j => j.category === 'Admission');
  const scholarship = jobs.filter(j => j.category === 'Scholarship');

  const features = [
    { label: '100% Free', sub: 'All features are free for all users', icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Fast Updates', sub: 'Instant updates on every exam', icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Reliable Source', sub: 'Official notifications only', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Easy to Use', sub: 'Simple and clean interface', icon: MousePointer2, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Dark Mode', sub: 'Switch to your preferred mode', icon: Moon, color: 'text-gray-500', bg: 'bg-gray-50' },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-8 space-y-12">
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
            More Resources
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Essential prep material and updates for all exams.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ListCard title="Syllabus" items={syllabus} icon={FileText} color="from-indigo-500 to-blue-500" />
          <ListCard title="Answer Keys" items={answerKeys} icon={HelpCircle} color="from-purple-500 to-pink-500" />
          <ListCard title="Admissions" items={admissions} icon={GraduationCap} color="from-emerald-500 to-teal-500" />
          <ListCard title="Scholarship" items={scholarship} icon={Zap} color="from-orange-500 to-red-500" />
        </div>
      </div>

      {/* Feature Strip */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px] gap-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">{feature.label}</span>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5">{feature.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
