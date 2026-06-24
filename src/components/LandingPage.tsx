import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Sparkles, 
  LogIn, 
  CheckCircle2, 
  Calendar, 
  ClipboardList, 
  Layers, 
  Users, 
  Kanban, 
  BarChart3, 
  Minimize, 
  Laptop, 
  Tablet, 
  Smartphone,
  UserPlus,
  Briefcase,
  Mail,
  Building
} from 'lucide-react';
import { Agency, LandingPageTexts } from '../types';

interface LandingPageProps {
  onLogin: (
    username: string, 
    role: 'admin' | 'user', 
    fullName: string, 
    avatar: string,
    agencyId?: string // to pass which agency database to load!
  ) => void;
  onEnterAsGuest: () => void;
  isDarkModeGlobal: boolean;
  customTexts?: LandingPageTexts;
}

export function LandingPage({ onLogin, onEnterAsGuest, isDarkModeGlobal, customTexts }: LandingPageProps) {
  const badgeText = customTexts?.badgeText || "Insurance Broker Multi-Agent Workstation";
  const heroTitle = customTexts?.heroTitle || "The Insurance Boss";
  const heroSubtitle = customTexts?.heroSubtitle || "Agency Management System";
  const heroDescription = customTexts?.heroDescription || "A premium collaborative workspace built specifically for insurance broker networks, multi-agent offices, and underwriters. Setup your agency account instantly to start blank, invite agents, create agent teams, register leads in the specialized CRM pipeline, and manage niche tasks.";
  const footerText = customTexts?.footerText || "Engineered to coordinate high-tier elite insurance client acquisition and distribution strategies with absolute precision.";
  // Login State
  const [loginMode, setLoginMode] = useState<'admin' | 'agent' | 'signup'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Signup/Agency Registration State
  const [agencyName, setAgencyName] = useState('');
  const [employees, setEmployees] = useState('1-5');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // Loaded agencies from localStorage
  const [registeredAgencies, setRegisteredAgencies] = useState<Agency[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('registered_agencies');
    if (stored) {
      try {
        setRegisteredAgencies(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse registered agencies', e);
      }
    }
  }, []);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agencyName.trim() || !agencyEmail.trim() || !adminUser.trim() || !adminPass.trim()) {
      setErrorMsg('Please complete all fields to establish your agency workspace.');
      return;
    }

    const cleanUser = adminUser.trim().toLowerCase();

    // Check if username already exists in registered agencies
    if (cleanUser === 'admin' || cleanUser === 'insuranceboss' || registeredAgencies.some(ag => ag.username === cleanUser)) {
      setErrorMsg('The selected username is already taken. Please pick another.');
      return;
    }

    const newAgency: Agency = {
      agencyName: agencyName.trim(),
      employees,
      email: agencyEmail.trim(),
      username: cleanUser,
      password: adminPass.trim()
    };

    const updated = [...registeredAgencies, newAgency];
    localStorage.setItem('registered_agencies', JSON.stringify(updated));
    setRegisteredAgencies(updated);

    // Initialize clean database inside localStorage for this new agency
    localStorage.setItem(`agency_${cleanUser}_tasks`, JSON.stringify([]));
    localStorage.setItem(`agency_${cleanUser}_members`, JSON.stringify([]));
    localStorage.setItem(`agency_${cleanUser}_leads`, JSON.stringify([]));
    localStorage.setItem(`agency_${cleanUser}_teams`, JSON.stringify([]));
    localStorage.setItem(`agency_${cleanUser}_messages`, JSON.stringify([]));
    localStorage.setItem(`agency_${cleanUser}_customFields`, JSON.stringify({
      label1: "Policy Type",
      options1: ["Auto", "Home", "Life", "Commercial", "Health", "Annuities"],
      label2: "Niche Task",
      options2: ["Policy Renewal", "Claim Follow-up", "Lead Outreach", "Quote Preparation", "In-person Meet", "Payment Issue"]
    }));

    setSignupSuccess('Agency workspace created successfully! You can now log in.');
    setLoginMode('admin');
    setUsername(cleanUser);
    setPassword(adminPass.trim());

    // Reset signup inputs
    setAgencyName('');
    setAgencyEmail('');
    setAdminUser('');
    setAdminPass('');
    setTimeout(() => setSignupSuccess(''), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check 1: Default Demo accounts
    if (loginMode === 'admin' && (cleanUser === 'admin' || cleanUser === 'insuranceboss') && cleanPass === 'boss admin') {
      const name = cleanUser === 'insuranceboss' ? 'Insurance Boss (Admin)' : 'Administrator';
      const avatar = 'https://images.unsplash.com/photo-1570295999915-56ceb5ecca61?auto=format&fit=crop&w=120&q=80';
      onLogin(cleanUser, 'admin', name, avatar, 'demo_agency');
      return;
    }

    // Check 2: Registered Agencies Admin login
    if (loginMode === 'admin') {
      const matchingAgency = registeredAgencies.find(ag => ag.username === cleanUser && ag.password === cleanPass);
      if (matchingAgency) {
        onLogin(
          matchingAgency.username, 
          'admin', 
          `${matchingAgency.agencyName} (Admin)`, 
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
          matchingAgency.username
        );
        return;
      }
      setErrorMsg('Invalid agency administrator credentials. Check your username and password.');
    }

    // Check 3: Registered Agent Login
    if (loginMode === 'agent') {
      // Look through all registered agencies to see if the user is a created agent!
      let foundAgent: any = null;
      let matchingAgencyId = '';

      for (const ag of registeredAgencies) {
        const storedMembers = localStorage.getItem(`agency_${ag.username}_members`);
        if (storedMembers) {
          try {
            const membersList = JSON.parse(storedMembers);
            const agent = membersList.find((m: any) => m.username === cleanUser && m.password === cleanPass);
            if (agent) {
              foundAgent = agent;
              matchingAgencyId = ag.username;
              break;
            }
          } catch (err) {
            console.error('Error parsing agency members', err);
          }
        }
      }

      // Check default demo agents if they try to log in
      if (!foundAgent && cleanUser === 'agent' && cleanPass === 'agent') {
        onLogin('agent', 'user', 'Campaign Agent', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', 'demo_agency');
        return;
      }

      if (foundAgent) {
        onLogin(
          foundAgent.id,
          'user',
          foundAgent.name,
          foundAgent.avatar,
          matchingAgencyId
        );
        return;
      }

      setErrorMsg('Agent login credentials not found. Ensure your Agency Admin has registered your account.');
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
            Enter as Demo Guest
          </button>
          <a
            href="#login-section"
            onClick={() => setLoginMode('signup')}
            className="bg-[#FAC000] hover:bg-[#e0ab00] text-[#0c0d12] text-xs font-bold px-3 sm:px-4 py-2 rounded-lg transition-transform hover:scale-105 shadow-md shadow-[#FAC000]/25 cursor-pointer whitespace-nowrap"
          >
            Create Agency Space
          </a>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FAC000]/10 text-[#FAC000] border border-[#FAC000]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FAC000]" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {heroTitle} <br />
            <span className="text-[#FAC000] bg-clip-text">{heroSubtitle}</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
            {heroDescription}
          </p>

          {/* Quick Features Highlight Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Building className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Agency Registration</h4>
                <p className="text-xs text-gray-400">Launch a brand new, fully customized blank workspace for your brokerage.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Users className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Agent Directory & Creator</h4>
                <p className="text-xs text-gray-400">Register agents with credentials, construct agent teams, and inspect portfolios.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <ClipboardList className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Specialized Insurance Tasks</h4>
                <p className="text-xs text-gray-400 font-normal">Track policies, handle underwriting, manage claim follow-ups and custom categories.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded bg-[#FAC000]/15 mt-0.5">
                <Shield className="w-4 h-4 text-[#FAC000]" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Proactive Lead CRM</h4>
                <p className="text-xs text-gray-400">Record prospective clients, log interest policy branches, and monitor status.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button 
              onClick={onEnterAsGuest}
              className="px-6 py-3.5 bg-[#FAC000] hover:bg-[#e0ab00] text-black font-extrabold rounded-xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-[#FAC000]/20 text-xs flex items-center gap-2 cursor-pointer border-none"
            >
              <span>Explore Demo Workspace</span>
              <span>&rarr;</span>
            </button>
            <div className="text-gray-400 text-xs font-medium">
              Or create your agency account on the right to start completely fresh.
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form Switcher with gold/yellow aesthetics */}
        <div className="lg:col-span-5 hover:scale-[1.01] transition-transform duration-300" id="login-section">
          <div className="bg-[#12131a] border-2 border-[#FAC000]/30 p-7 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAC000]/5 rounded-full blur-3xl" />
            
            {/* Form Switcher tabs */}
            <div className="flex border-b border-gray-800/80 mb-6 text-center select-none">
              <button
                onClick={() => {
                  setLoginMode('admin');
                  setErrorMsg('');
                }}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
                  loginMode === 'admin' 
                    ? 'text-[#FAC000] border-[#FAC000]' 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                Admin Agency
              </button>
              <button
                onClick={() => {
                  setLoginMode('agent');
                  setErrorMsg('');
                }}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
                  loginMode === 'agent' 
                    ? 'text-[#FAC000] border-[#FAC000]' 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                Agent Access
              </button>
              <button
                onClick={() => {
                  setLoginMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
                  loginMode === 'signup' 
                    ? 'text-[#FAC000] border-[#FAC000]' 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                Register Agency
              </button>
            </div>

            {/* Notification messages */}
            {signupSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-3 text-xs text-emerald-200 text-center font-semibold mb-4">
                {signupSuccess}
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-3 text-xs text-red-200 text-center font-semibold mb-4">
                {errorMsg}
              </div>
            )}

            {/* LOGIN FORMS */}
            {loginMode !== 'signup' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-1 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAC000]/10 flex items-center justify-center border border-[#FAC000]/20 mb-1">
                    <Shield className="w-6 h-6 text-[#FAC000] animate-pulse" />
                  </div>
                  <h2 className="text-md font-bold text-white tracking-tight">
                    {loginMode === 'admin' ? 'Agency Admin Portal' : 'Agent Workstation Access'}
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    {loginMode === 'admin' 
                      ? 'Access full admin dashboards, agent control panel, leads list and teams.' 
                      : 'Log in to manage your assigned insurance tasks, joint projects, and prospective leads.'}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#FAC000] tracking-wider mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loginMode === 'admin' ? 'insuranceboss' : 'agent_username'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1b1c25] border border-gray-800 focus:border-[#FAC000] rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#FAC000] tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1b1c25] border border-gray-800 focus:border-[#FAC000] rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase text-xs py-3 rounded-xl transition-all shadow-md shadow-[#FAC000]/10 flex items-center justify-center gap-2 cursor-pointer mt-4 border-none"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Verify & Launch Workspace</span>
                </button>

                {loginMode === 'admin' && (
                  <div className="border-t border-gray-850 pt-3.5 text-center">
                    <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-bold mb-1">
                      Demo Admin Credentials
                    </span>
                    <code className="text-[10px] text-gray-450 bg-black/50 px-2 py-1 rounded border border-gray-850 block font-mono">
                      User: <span className="text-[#FAC000] font-bold">insuranceboss</span> | Pass: <span className="text-[#FAC000] font-bold">boss admin</span>
                    </code>
                  </div>
                )}

                {loginMode === 'agent' && (
                  <div className="border-t border-gray-850 pt-3.5 text-center">
                    <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-bold mb-1">
                      Demo Agent Credentials
                    </span>
                    <code className="text-[10px] text-gray-450 bg-black/50 px-2 py-1 rounded border border-gray-850 block font-mono">
                      User: <span className="text-[#FAC000] font-bold">agent</span> | Pass: <span className="text-[#FAC000] font-bold">agent</span>
                    </code>
                  </div>
                )}
              </form>
            ) : (
              /* AGENCY REGISTRATION/SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div className="flex flex-col items-center text-center space-y-1 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAC000]/10 flex items-center justify-center border border-[#FAC000]/20 mb-1">
                    <UserPlus className="w-6 h-6 text-[#FAC000]" />
                  </div>
                  <h2 className="text-md font-bold text-white tracking-tight">Create Agency Space</h2>
                  <p className="text-[11px] text-gray-400">
                    Establish a clean, personalized workspace for your insurance office.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#FAC000] tracking-wider mb-1">
                      Agency Name ("Nombre") *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Valle Insurance"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full bg-[#1b1c25] border border-gray-850 focus:border-[#FAC000] rounded-xl px-3 py-2 text-xs text-white outline-none transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#FAC000] tracking-wider mb-1">
                      Staff Count ("Empleados")
                    </label>
                    <select
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      className="w-full bg-[#1b1c25] border border-gray-850 focus:border-[#FAC000] rounded-xl px-3 py-2 text-xs text-white outline-none transition-all font-semibold"
                    >
                      <option value="1-5">1 - 5 Agents</option>
                      <option value="6-15">6 - 15 Agents</option>
                      <option value="16-50">16 - 50 Agents</option>
                      <option value="50+">50+ Agents</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-[#FAC000] tracking-wider mb-1">
                    Email address ("Correo") *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="broker@valleinsurance.com"
                    value={agencyEmail}
                    onChange={(e) => setAgencyEmail(e.target.value)}
                    className="w-full bg-[#1b1c25] border border-gray-850 focus:border-[#FAC000] rounded-xl px-3 py-2 text-xs text-white outline-none transition-all"
                  />
                </div>

                {/* Credentials block */}
                <div className="bg-black/40 p-3 rounded-xl border border-gray-850 space-y-2">
                  <span className="block text-[9px] uppercase font-black text-[#FAC000] tracking-widest">Master Admin Login</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Username *</label>
                      <input
                        type="text"
                        required
                        placeholder="valle_admin"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        className="w-full bg-[#1b1c25] border border-gray-850 focus:border-[#FAC000] rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-all font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full bg-[#1b1c25] border border-gray-850 focus:border-[#FAC000] rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase text-xs py-3 rounded-xl transition-all shadow-md shadow-[#FAC000]/10 flex items-center justify-center gap-1.5 mt-3 border-none cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Establish Agency Space</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* Screen Responsiveness Showcase Map Container */}
      <section className="bg-[#090a10] border-t border-b border-gray-900/60 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] text-[#FAC000] font-black uppercase tracking-widest">Multi-Agent Workspace Security</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">Full Adaptation on All Digital Devices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
            <div className="p-4 bg-[#11121a] rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <Laptop className="w-8 h-8 text-[#FAC000]" />
              <h5 className="text-xs font-extrabold text-white">Desktop Control Panel</h5>
              <p className="text-[11px] text-gray-400">Admins can see all agents, create teams, monitor prospective leads, and oversee active insurance tasks comfortably.</p>
            </div>
            <div className="p-4 bg-[#11121a] rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <Tablet className="w-8 h-8 text-[#FAC000]" />
              <h5 className="text-xs font-extrabold text-white">Mobile Portability</h5>
              <p className="text-[11px] text-gray-400">Agents can register prospective clients, edit policy logs, and discuss issues directly from their iPad or tablets in the field.</p>
            </div>
            <div className="p-4 bg-[#11121a] rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <Smartphone className="w-8 h-8 text-[#FAC000]" />
              <h5 className="text-xs font-extrabold text-white">Client Handshake</h5>
              <p className="text-[11px] text-gray-400">Quickly add follow-up records or create task assignments together with team colleagues on simple handy mobile devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid in Dark & Yellow */}
      <section className="bg-[#0a0b11] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-2 mb-16">
            <h3 className="text-2xl sm:text-4xl font-black text-[#FAC000] tracking-tight">Enterprise Broker Benefits</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
              Equip your insurance distribution agency with robust lead tracking, cooperative task management, visual schedulers, and secure multi-agent profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">01</span>
              <h4 className="text-sm font-bold text-white mb-2">Agency Blank Start</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                When you create a brand new account, the workspace initializes completely blank so you can construct your database from scratch without any pre-existing noise.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">02</span>
              <h4 className="text-sm font-bold text-white mb-2">Flexible Task Management</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Organize policy renewals, claims handling, premium invoicing, and consultations using visual columns. Customize field names and options dynamically.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">03</span>
              <h4 className="text-sm font-bold text-white mb-2">Collaborative Action</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Agents can create and coordinate tasks "en conjunto" by assigning multiple team members to a single high-priority client item.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">04</span>
              <h4 className="text-sm font-bold text-white mb-2">Insurance Prospective CRM</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Register potential policyholders, log contact emails/phones, flag interested coverage branches, and assign advisors with ease.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">05</span>
              <h4 className="text-sm font-bold text-white mb-2">Functional Schedulers</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Evaluate your agencys operational capacity using interactive weekly schedulers and full horizontal Gantt milestones.
              </p>
            </div>

            <div className="bg-[#111218] border border-gray-800/80 p-6 rounded-2xl relative">
              <span className="text-[#FAC000] text-3xl font-black absolute top-4 right-6 opacity-20">06</span>
              <span className="text-[#0fa] text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black absolute top-4 left-6 uppercase tracking-wider">
                Multi-Tenant ready
              </span>
              <h4 className="text-sm font-bold text-white mb-2">Secured Agent Credentials</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Each agent has their own login. They only see what is relevant to their workflows, shielding sensitive master workspace properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-900 bg-[#06070a] text-center text-xs text-gray-600">
        <p>&copy; 2026 The Insurance Boss Task Management. All rights reserved.</p>
        <p className="mt-1 text-gray-700">{footerText}</p>
      </footer>
    </div>
  );
}
