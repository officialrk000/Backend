import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Calendar, Building2, ExternalLink, Download, Globe, Info, Clock, CreditCard, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Job } from '../types';
import { formatDate } from '../utils/formatters';
import Header from './Header';
import Footer from './Footer';

export default function JobDetailPage() {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchJob = async () => {
      if (!id || !category) return;
      
      setLoading(true);
      try {
        const tableMap: Record<string, string> = {
          'Latest Job': 'jobs',
          'Admit Card': 'admit_cards',
          'Result': 'results',
          'Admission': 'admissions',
          'Answer Key': 'answer_keys',
          'Syllabus': 'jobs',
          'Scholarship': 'jobs',
          'Important Update': 'jobs'
        };

        const tableName = tableMap[category] || 'jobs';
        const { data, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Post not found');

        // Normalize
        const normalizedJob: Job = {
          ...data,
          category: category as any,
          title: data.title || data.post_name || '',
          organization: data.organization || data.department || '',
          postDate: data.postDate || data.created_at || data.post_date || '',
          deadline: data.deadline || data.important_dates || '',
          officialLink: data.officialLink || data.apply_link || data.official_link || '',
          imageUrl: data.imageUrl || data.image_url || ''
        };

        setJob(normalizedJob);
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
    window.scrollTo(0, 0);
  }, [id, category]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this ${job?.category}: ${job?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header searchQuery="" onSearchChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header searchQuery="" onSearchChange={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-red-50 p-6 rounded-3xl mb-6">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">{error || 'The requested post could not be found.'}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header searchQuery="" onSearchChange={(q) => navigate(`/?q=${q}`)} />

      <main className="flex-1 py-8 px-4 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs / Back button */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-blue-100 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              Back
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group"
            >
              Share
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-blue-100 transition-all">
                <Share2 className="w-5 h-5" />
              </div>
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100"
          >
            {/* Top Banner */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="px-6 md:px-12 pb-12 -mt-20 relative">
              {/* Profile/Logo Area */}
              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-2xl border-8 border-white flex items-center justify-center overflow-hidden">
                  {job.imageUrl ? (
                    <img src={job.imageUrl} alt={job.organization} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Building2 className="w-16 h-16 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 md:pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                      {job.category}
                    </span>
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 font-bold mt-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    {job.organization}
                  </p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Summary Grid */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-center">
                      <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Post Date</div>
                      <div className="text-base font-black text-gray-900">{formatDate(job.postDate)}</div>
                    </div>
                    <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 text-center">
                      <Clock className="w-6 h-6 text-red-500 mx-auto mb-2" />
                      <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Last Date</div>
                      <div className="text-base font-black text-red-600">{formatDate(job.deadline)}</div>
                    </div>
                    <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 text-center">
                      <CreditCard className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Fee</div>
                      <div className="text-sm font-bold text-emerald-700 truncate">{job.application_fees || 'Check Details'}</div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <DetailSection title="Important Dates" icon={Calendar}>
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {job.important_dates || `Please apply before ${formatDate(job.deadline)}.`}
                        </p>
                      </div>
                    </DetailSection>

                    <DetailSection title="Age Limit" icon={Clock}>
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <p className="text-gray-700 font-bold text-base">
                          {job.age_limit || 'As per official recruitment rules.'}
                        </p>
                      </div>
                    </DetailSection>

                    <DetailSection title="Application Fees" icon={CreditCard}>
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <p className="text-gray-700 whitespace-pre-wrap font-medium">
                          {job.application_fees || 'See detailed notification.'}
                        </p>
                      </div>
                    </DetailSection>

                    {job.description && (
                      <DetailSection title="Job Description & Eligibility" icon={Info}>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                          <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed">
                            {job.description}
                          </div>
                        </div>
                      </DetailSection>
                    )}

                    <DetailSection title="How to Apply" icon={Globe}>
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="space-y-4">
                          {(job.how_to_fill || 'Visit the official website\nRegister yourself\nFill the application form carefully\nPay the required fee\nSubmit and take a printout').split('\n').filter(s => s.trim()).map((step, index) => (
                            <div key={index} className="flex gap-4 group">
                              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all border border-blue-100">
                                {index + 1}
                              </div>
                              <div className="pt-1 text-sm text-gray-700 leading-relaxed font-medium">
                                {step.replace(/^\d+\.\s*/, '')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DetailSection>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                  <div className="sticky top-24 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Official Links</h3>
                    
                    {job.officialLink && (
                      <ActionLink 
                        href={job.officialLink}
                        icon={ExternalLink}
                        label="Apply Online Now"
                        sub="Direct Application Link"
                        variant="primary"
                      />
                    )}

                    {job.notification_link && (
                      <ActionLink 
                        href={job.notification_link}
                        icon={Download}
                        label="Download Notification"
                        sub="Official PDF Document"
                        variant="secondary"
                      />
                    )}

                    {job.official_website && (
                      <ActionLink 
                        href={job.official_website}
                        icon={Globe}
                        label="Official Website"
                        sub="Department Portal"
                        variant="outline"
                      />
                    )}

                    <div className="bg-gray-900 rounded-3xl p-6 text-white mt-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">SS</div>
                        <div>
                          <div className="font-black">Sarkari Setu</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Job Portal</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        Get instant updates about latest government jobs, results, and admit cards directly on your phone.
                      </p>
                      <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-all">
                        Enable Notifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-black text-gray-900 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Icon className="w-4 h-4" />
        </div>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ActionLink({ href, icon: Icon, label, sub, variant }: { href: string, icon: any, label: string, sub: string, variant: 'primary' | 'secondary' | 'outline' }) {
  const baseClasses = "w-full p-5 rounded-3xl flex items-center justify-between transition-all group";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200",
    outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`${baseClasses} ${variants[variant]}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${variant === 'outline' ? 'bg-gray-100 text-gray-600' : 'bg-white/20 text-white'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-black text-sm">{label}</div>
          <div className={`text-[10px] font-bold uppercase tracking-widest ${variant === 'outline' ? 'text-gray-400' : 'text-white/60'}`}>{sub}</div>
        </div>
      </div>
      <ExternalLink className={`w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${variant === 'outline' ? 'text-gray-300' : 'text-white/40'}`} />
    </a>
  );
}
