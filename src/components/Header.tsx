import React from 'react';
import { 
  Search, Bell, Menu, X, Moon, Sun, User, 
  Home, Briefcase, FileText, CheckCircle, HelpCircle, 
  BookOpen, GraduationCap, Newspaper, PhoneCall,
  LayoutGrid, ChevronDown, MessageCircle, Youtube, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PushNotification from './PushNotification';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Home', href: '#', icon: Home },
    { name: 'Latest Jobs', href: '#', icon: Briefcase },
    { name: 'Admit Cards', href: '#', icon: FileText },
    { name: 'Results', href: '#', icon: CheckCircle },
    { name: 'Answer Keys', href: '#', icon: HelpCircle },
    { name: 'Syllabus', href: '#', icon: BookOpen },
    { name: 'Scholarships', href: '#', icon: GraduationCap },
    { name: 'News', href: '#', icon: Newspaper },
    { name: 'Contact Us', href: '#', icon: PhoneCall },
  ];

  return (
    <div className="flex flex-col w-full sticky top-0 z-[100]">
      {/* Top Strip */}
      <div className="bg-[#0f172a] text-white text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Bell className="w-3.5 h-3.5 text-white fill-white" />
              Latest Updates
            </span>
            <div className="h-4 w-px bg-gray-700 mx-2" />
            <div className="flex gap-8 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap flex gap-8">
                <span>SSC CGL 2024 Final Result Out Now</span>
                <span>UPSC CSE 2024 Admit Card Released</span>
                <span>Railway RRB ALP Exam Date Announced</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <span className="text-gray-400">Follow Us :</span>
            <div className="flex gap-2.5">
              <a href="#" className="bg-[#0088cc] p-1 rounded-full"><Send className="w-3 h-3 fill-white" /></a>
              <a href="#" className="bg-[#25d366] p-1 rounded-full"><MessageCircle className="w-3 h-3 fill-white" /></a>
              <a href="#" className="bg-[#ff0000] p-1 rounded-full"><Youtube className="w-3 h-3 fill-white" /></a>
            </div>
          </div>
        </div>
      </div>

      <header className={`w-full transition-all duration-300 ${isScrolled ? 'glass py-2 shadow-sm' : 'bg-white py-3'}`}>
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://i.ibb.co/Y4NLpVg9/app-logo.png" 
                alt="SarkariSetu Logo" 
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#0f172a] leading-none tracking-tight">
                  Sarkari<span className="text-orange-500">Setu</span>
                </span>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5">Your Bridge to Sarkari Jobs</span>
              </div>
            </div>

            {/* Search Bar Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
              <div className="w-full relative group">
                <input 
                  type="text" 
                  placeholder="Search for Jobs, Results, Admit Cards..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 mr-2">
                {['About Us', 'Privacy Policy', 'Disclaimer', 'Sitemap'].map(item => (
                  <a 
                    key={item} 
                    href="#" 
                    className="text-[11px] font-bold text-gray-500 hover:text-blue-600 transition-all uppercase tracking-wider"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                <button 
                  onClick={toggleDarkMode}
                  className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-[#0f172a] text-white' : 'text-gray-400'}`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block border-t border-gray-100 mt-2 bg-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 ${link.name === 'Home' ? 'text-blue-600 border-blue-600' : 'text-gray-500'}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative group mb-4">
                  <input 
                    type="text" 
                    placeholder="Search jobs..." 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {navLinks.map((link) => (
                    <a 
                      key={link.name} 
                      href={link.href}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </a>
                  ))}
                </div>
                <div className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {['About Us', 'Privacy', 'Disclaimer', 'Sitemap'].map(item => (
                      <a 
                        key={item} 
                        href="#" 
                        className="p-3 bg-gray-50 rounded-xl text-[11px] font-bold text-gray-500 text-center uppercase"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
