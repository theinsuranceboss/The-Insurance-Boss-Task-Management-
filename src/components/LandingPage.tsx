import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, LogIn, CheckCircle2, Calendar, ClipboardList, Layers, Users, Kanban, BarChart3, Minimize, Laptop, Tablet, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onLogin: (username: string, role: 'admin' | 'user', fullName: string, avatar: string) => void;
  onEnterAsGuest: () => void;
  isDarkModeGlobal: boolean;
}

export function LandingPage({ onLogin, onEnterAsGuest, isDarkModeGlobal }: LandingPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if ((cleanUser === 'admin' || cleanUser === 'insuranceboss') && cleanPass === 'boss admin') {
      const name = cleanUser === 'insuranceboss' ? 'Insurance Boss (Admin)' : 'Administrator';
      const avatar = cleanUser === 'insuranceboss' 
        ? 'https://images.unsplash.com/photo-1570295999915-56ceb5ecca61?auto=format&fit=crop&w=120&q=80' 
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80';
      onLogin(cleanUser, 'admin', name, avatar);
    } else {
      setErrorMsg('Invalid login credentials. Please use "admin" / "boss admin"');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0c0d12] text-white flex flex-col font-sans selection:bg-[#FAC000] selection:text-black" id="ib-landing-root">
      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-gray-800/60 bg-[#0c0d12]/90 backdrop-blur sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://theinsuranceboss.com/wp-content/uploads/2026/05/IB-Logo-1.png" 
            alt="The Insurance Boss Logo" 
            className="h-10 object-contain text-white text-xs"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-extrabold text-sm sm:text-base tracking-wider text-[#FAC000] uppercase">
            The Insurance Boss
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onEnterAsGuest}
            className="text-gray-400 hover:text-[#FAC000] text-xs font-semibold px-2 sm:px-3 py-2 transition-colors cursor-pointer"
          >
            Enter as Guest
          </button>
          <a
            href="#login-section"
            className="bg-[#FAC000] hover:bg-[#e0ab00] text-[#0c0d12] text-xs font-bold px-3 sm:px-4 py-2 rounded-lg transition-transform hover:scale-105 shadow-md shadow-[#FAC000]/25 cursor-pointer whitespace-nowrap"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FAC000]/10 text-[#FAC000] border border-[#FAC000]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FAC000]" />
            <span>Insurance Boss Workspace custom suite</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            The Insurance Boss <br />
            <span className="text-[#FAC000] bg-clip-text">Task Management Suite</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
            The premium collaborative workspace built specifically for insurance networks, marketers, and lead activators. Seamlessly schedule campaigns, coordinate team members, assign priority tasks, manage client pipelines, and evaluate performance over elegant responsive views.
          </p>

          {/* Quick Features Highlight Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Calendar className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Advanced Campaign Schedulers</h4>
                <p className="text-xs text-gray-400">Map out monthly & weekly distribution channels with zero friction.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Users className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Full Team Collaboration</h4>
                <p className="text-xs text-gray-400">Organize channels, write live updates, and tag agents to collaborate.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Kanban className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Interactive task Boards</h4>
                <p className="text-xs text-gray-400">Classify, status-group, color-tag, and search projects securely.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Shield className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Adaptive Layout Viewports</h4>
                <p className="text-xs text-gray-400 font-normal">Sleek adaptive components built for mobile, tablet, and widescreen devices.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button 
              onClick={onEnterAsGuest}
              className="px-6 py-3.5 bg-[#FAC000] hover:bg-[#e0ab00] text-black font-extrabold rounded-xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-[#FAC000]/20 text-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Enter Workspace as Guest</span>
              <span>&rarr;</span>
            </button>
            <div className="text-gray-400 text-xs font-medium">
              Or sign in with Admin credentials to configure workspace assets.
            </div>
          </div>
        </div>

        {/* Right Column: Beautiful Login Box themed in Dark & Yellow */}
        <div className="lg:col-span-5 hover:scale-[1.01] transition-transform duration-300" id="login-section">
          <div className="bg-[#12131a] border-2 border-[#FAC000]/30 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAC000]/5 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#FAC000]/10 flex items-center justify-center border border-[#FAC000]/20 mb-2">
                <Shield className="w-7 h-7 text-[#FAC000] animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Login Access</h2>
              <p className="text-xs text-gray-400">
                Sign in to manage tasks, invite team members, configure spaces, and track metrics.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-3 text-xs text-red-200 text-center font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#FAC000] tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="insuranceboss"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1b1c25] border border-gray-800/80 focus:border-[#FAC000] focus:ring-1 focus:ring-[#FAC000]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#FAC000] tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1b1c25] border border-gray-800/80 focus:border-[#FAC000] focus:ring-1 focus:ring-[#FAC000]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase text-xs py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-md shadow-[#FAC000]/20 flex items-center justify-center gap-2 cursor-pointer mt-2 border-none"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify & Launch</span>
              </button>
            </form>

            <div className="border-t border-gray-850 pt-4 text-center">
              <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-bold mb-1">
                Demo Preview Credentials
              </span>
              <code className="text-[10px] text-gray-450 bg-black/50 px-2 py-1.5 rounded border border-gray-800/90 block font-mono leading-relaxed">
                Username: <span className="text-[#FAC000] font-bold">insuranceboss</span> <br className="sm:hidden" /> <span className="hidden sm:inline">|</span> Password: <span className="text-[#FAC000] font-bold">boss admin</span>
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Screen Responsiveness Showcase Map Container */}
      <section className="bg-[#090a10] border-t border-b border-gray-900/60 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] text-[#FAC000] font-black uppercase tracking-widest">Pixel-Perfect Layout Scaling</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">Full Adaptation on All Digital Devices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
            <div className="p-4 bg-[#11121a] rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <Laptop className="w-8 h-8 text-[#FAC000]" />
              <h5 className="text-xs font-extrabold text-white">Desktop / Web</h5>
              <p className="text-[11px] text-gray-400">Side panels, active workflows, structured layout matrices, and charts render natively with beautiful ease.</p>
            </div>
            <div className="p-4 bg-[#11121a] rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <Tablet className="w-8 h-8 text-[#FAC000]" />
              <h5 className="text-xs font-extrabold text-white">Tablets & Pads</h5>
              <p className="text-[11px] text-gray-400">Touch responsiveness, fluid grid wrapping, custom overlays, and collapses ensure complete control at your fingertips.</p>
            </div>
            <div className="p-4 bg-[#11121a] rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <Smartphone className="w-8 h-8 text-[#FAC000]" />
              <h5 className="text-xs font-extrabold text-white">Mobile Viewports</h5>
              <p className="text-[11px] text-gray-400">Togglable compact side-drawers, custom navigation items, active boards, and clean layout flow fit beautifully in your hand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid in Dark & Yellow */}
      <section className="bg-[#0a0b11] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-2 mb-16">
            <h3 className="text-2xl sm:text-4xl font-black text-[#FAC000] tracking-tight">Main System Core Benefits</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
              Equip your insurance distribution agency with robust client tracking, active communications, interactive content timelines, and intuitive workspaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">01</span>
              <h4 className="text-sm font-bold text-white mb-2">Campaign & Space Folders</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add and structure Space folders for your campaigns, assets, and insurance goals. Organize items chronologically with custom weeks and months.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">02</span>
              <h4 className="text-sm font-bold text-white mb-2">Flexible Task Director Board</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add, manage, and edit tasks dynamically. Change state values seamlessly (Pending, In Progress, In Review, Posted, Approved) with color indicators.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">03</span>
              <h4 className="text-sm font-bold text-white mb-2">Comment Boards & Team Chats</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Empower direct team collaboration. Write custom discussions, tag colleagues directly with "@" mentions, upload attachments, and coordinate content assets.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">04</span>
              <h4 className="text-sm font-bold text-white mb-2">CRM Insurance Clientele Tracking</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Monitor and record policy conversions, manage client communications progress, check active leads pipelines, and evaluate policy values in real-time.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">05</span>
              <h4 className="text-sm font-bold text-white mb-2">Horizontal Scheduling Timeline</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Map events and campaign launch milestones on our customized visual Gantt timeline chart representing columns for complete team coordination.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">06</span>
              <h4 className="text-sm font-bold text-white mb-2">Customized Admin Panel Controls</h4>
              <p className="text-[#0fa] text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black absolute top-4 left-6 uppercase tracking-wider">
                Authority Managed
              </p>
              <h4 className="text-sm font-bold text-white mb-2">Administrative User Creation</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Manage roles and invite users as general members or executive admins, keeping workspace integrity highly secure and controlled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-900 bg-[#06070a] text-center text-xs text-gray-600">
        <p>&copy; 2026 The Insurance Boss Task Management. All rights reserved.</p>
        <p className="mt-1 text-gray-700">Engineered to coordinate high-tier elite insurance client acquisition and distribution strategies with absolute precision.</p>
      </footer>
    </div>
  );
}
