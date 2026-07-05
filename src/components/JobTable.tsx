import React from 'react';
import { ExternalLink, Calendar, Building2 } from 'lucide-react';
import { Job } from '../types';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

interface JobTableProps {
  jobs: Job[];
  loading: boolean;
  onJobClick?: (job: Job) => void;
}

export default function JobTable({ jobs, loading }: JobTableProps) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500">No job notifications found.</p>
      </div>
    );
  }

  const handleRowClick = (job: Job) => {
    navigate(`/post/${encodeURIComponent(job.category)}/${job.id}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-500 text-sm font-medium">
              <th className="px-4 py-2">Post Name</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <motion.tr 
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white hover:bg-blue-50 transition-colors group cursor-pointer"
                onClick={() => handleRowClick(job)}
              >
                <td className="px-4 py-4 rounded-l-xl border-y border-l border-gray-100">
                  <span className="font-semibold text-gray-900">{job.title}</span>
                </td>
                <td className="px-4 py-4 border-y border-gray-100 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {job.organization}
                  </div>
                </td>
                <td className="px-4 py-4 border-y border-gray-100 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(job.deadline)}
                  </div>
                </td>
                <td className="px-4 py-4 rounded-r-xl border-y border-r border-gray-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(job);
                    }}
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {jobs.map((job) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 flex-1">{job.title}</h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                {job.category}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                {job.organization}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-red-500">Deadline: {formatDate(job.deadline)}</span>
              </div>
            </div>
            <button 
              onClick={() => handleRowClick(job)}
              className="block w-full text-center bg-gray-50 text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors border border-blue-100"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
