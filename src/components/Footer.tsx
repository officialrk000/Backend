import React from 'react';
import { LayoutGrid, Mail, Phone, MapPin, Youtube, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://i.ibb.co/Y4NLpVg9/app-logo.png" 
                alt="SarkariSetu Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-black tracking-tight text-gray-900">
                Sarkari<span className="text-orange-500">Setu</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              SarkariSetu is India's most trusted portal for government job seekers. 
              We provide accurate and fast updates on latest jobs, exams, and results.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-gray-50 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-gray-50 rounded-xl text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-gray-50 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Latest Jobs', 'Results', 'Admit Cards', 'Syllabus', 'Answer Keys', 'Admissions'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Useful Information</h4>
            <ul className="space-y-4">
              {['About Us', 'Privacy Policy', 'Disclaimer', 'Terms of Service', 'Official Source', 'Sitemap'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Support Center</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase">Email Us</span>
                  <span className="text-sm font-semibold text-gray-900">support@sarkarisetu.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © {currentYear} SARKARISETU. MADE IN INDIA 🇮🇳
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Fast Loading</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Secure Data</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Real-time</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
