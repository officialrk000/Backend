import React from 'react';
import { Job } from '../types';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, FileText, Briefcase } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface JobFeedProps {
  jobs: Job[];
  loading: boolean;
  onJobClick?: (job: Job) => void;
}

const Section = ({ title, items, icon: Icon, color, accentColor }: { title: string, items: Job[], icon: any, color: string, accentColor: string }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${accentColor}`} />
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <button className="text-[11px] font-bold text-gray-400 border border-gray-100 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-gray-50">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs font-medium">No recent updates</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.slice(0, 10).map((job) => (
              <button 
                key={job.id} 
                onClick={() => navigate(`/post/${encodeURIComponent(job.category)}/${job.id}`)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group text-left"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0`} />
                  <h4 className="text-[13px] font-semibold text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-[10px] font-bold ${accentColor} opacity-70`}>{formatDate(job.postDate)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 bg-gray-50/50">
        <button className={`w-full py-2.5 rounded-lg border border-gray-100 bg-white text-xs font-bold ${accentColor} hover:bg-white transition-all flex items-center justify-center gap-2`}>
          View All {title}s <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default function JobFeed({ jobs, loading }: JobFeedProps) {
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 grid md:grid-cols-3 gap-6 py-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const results = jobs.filter(j => j.category === 'Result');
  const admitCards = jobs.filter(j => j.category === 'Admit Card');
  const latestJobs = jobs.filter(j => j.category === 'Latest Job');

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section title="Result" items={results} icon={CheckCircle} color="bg-emerald-500" accentColor="text-emerald-600" />
        <Section title="Admit Card" items={admitCards} icon={FileText} color="bg-violet-500" accentColor="text-violet-600" />
        <Section title="Latest Job" items={latestJobs} icon={Briefcase} color="bg-blue-500" accentColor="text-blue-600" />
      </div>
    </section>
  );
}
