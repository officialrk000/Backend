import React from 'react';
import { supabase } from '../lib/supabase';
import { Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PushNotification() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');
  const [showModal, setShowModal] = React.useState(false);

  const handleSubscribe = async () => {
    setStatus('loading');
    
    const mockToken = `user_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error: fetchError } = await supabase
        .from('subscribers')
        .select('token')
        .eq('token', mockToken);
      
      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert([
            {
              token: mockToken,
              createdAt: new Date().toISOString()
            }
          ]);
        
        if (insertError) throw insertError;
      }
      
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => setShowModal(false), 2000);
      }, 1500);
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('idle');
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
      >
        <Bell className="w-4 h-4" />
        Get Alerts
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                {status === 'success' ? (
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                ) : (
                  <Bell className="w-10 h-10 text-blue-600" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {status === 'success' ? 'Subscribed!' : 'Job Alerts'}
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                {status === 'success' 
                  ? "You'll now receive real-time notifications for new government exam announcements."
                  : "Never miss a deadline! Subscribe to get instant alerts for the latest government jobs."}
              </p>

              {status === 'success' ? (
                <div className="text-green-600 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Ready to Notify
                </div>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Maybe Later
                  </button>
                  <button 
                    onClick={handleSubscribe}
                    disabled={status === 'loading'}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                  >
                    {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
