import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppRail } from './components/AppRail';
import { ContentSidebar } from './components/ContentSidebar';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { TaskView } from './components/TaskView';
import { ChatView } from './components/ChatView';
import { ScheduleView } from './components/ScheduleView';
import { CustomersView } from './components/CustomersView';
import { LandingPage } from './components/LandingPage';
import { AdminPanel } from './components/AdminPanel';

import { 
  INITIAL_MEMBERS, 
  INITIAL_TASKS, 
  INITIAL_CUSTOMERS, 
  INITIAL_CHAT_MESSAGES 
} from './data/mockData';
import { Task, TaskStatus, Priority, Member, Customer, ChatMessage, ActiveTab } from './types';

export default function App() {
  // Global Database states
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // App Configuration States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatar: string; role: 'admin' | 'user' } | null>(null);

  // Layout View states
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [selectedFolder, setSelectedFolder] = useState('Campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. ADD / CREATE TASK ACTION
  const handleAddTask = (
    title: string, 
    status: TaskStatus = 'PENDING', 
    priority: Priority = 'NORMAL', 
    assigneeIds: string[] = [],
    month = 'April',
    week = 'Week 1',
    typeOfPost = 'AnimatedVideo',
    socialMedia = 'Instagram/Facebook',
    url = '',
    description = '',
    isDaily = false,
    folderName = 'Campaigns',
    attachments: { name: string; url: string }[] = [],
    dueDate = '2026-04-30'
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      status,
      priority,
      assigneeIds: assigneeIds.length > 0 ? assigneeIds : ['alex'],
      dueDate,
      month,
      week,
      typeOfPost,
      socialMedia,
      url,
      isDaily,
      folderName,
      subtasks: [],
      commentCount: 0,
      attachments,
      commentsList: []
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // 2. UPDATE TASK STATUS ACTION
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // 3. COMPLETE TASK OBJECT UPDATE
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // 4. DELETE TASK ACTION
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // 5. CRM CLIENT ACTION
  const handleAddCustomer = (company: string, contactName: string, email: string, value: string, status: 'Active' | 'Lead') => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      company,
      contactName,
      email,
      status,
      value: value.startsWith('$') ? value : `$${value}`,
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=120&q=80'
    };
    setCustomers(prev => [newCust, ...prev]);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // 6. ADDTIONAL MEMBERS (ADMIN PANEL ACTION)
  const handleAddMember = (newMem: Omit<Member, 'badgeCount'>) => {
    setMembers(prev => [...prev, newMem as Member]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // 7. SEND WORKSPACE CHAT CORRESPONDENCE WITH SIMULATED REPLIES
  const handleSendMessage = (text: string) => {
    const senderName = currentUser ? currentUser.name : 'Me';
    const senderAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';
    const senderId = currentUser ? currentUser.id : 'user';

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderAvatar,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // Schedule automated simulation replies from a random team member
    setTimeout(() => {
      const sampleReplies = [
        "Let me coordinate with Zeb and Dean P. to double check this content schedule! 📅",
        "Great point, I've got a campaign scheduled on social and this fits perfectly.",
        "Got it on my radar! I am drafting the newsletter copy now in Google Docs.",
        "Looks excellent! Let me update our Figma design workflow specs with this.",
        "Thanks for the heads-up. I am tracking the progress in real-time."
      ];
      
      const responder = members[Math.floor(Math.random() * members.length)];
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        senderId: responder.id,
        senderName: responder.name,
        senderAvatar: responder.avatar,
        senderColor: responder.color,
        content: sampleReplies[Math.floor(Math.random() * sampleReplies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleLogin = (username: string, role: 'admin' | 'user', fullName: string, avatar: string) => {
    setCurrentUser({ id: username, name: fullName, avatar, role });
    setShowLanding(false);
    setActiveTab('tasks');
  };

  const handleEnterAsGuest = () => {
    setCurrentUser({ id: 'guest', name: 'Guest Client', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', role: 'user' });
    setShowLanding(false);
    setActiveTab('tasks');
  };

  const handleSignout = () => {
    setCurrentUser(null);
    setShowLanding(true);
  };

  // Total uncompleted tasks counter badge
  const activeTasksCount = tasks.filter(t => t.status !== 'POSTED').length;

  if (showLanding) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        onEnterAsGuest={handleEnterAsGuest} 
        isDarkModeGlobal={isDarkMode} 
      />
    );
  }

  return (
    <div className={`w-full h-screen flex overflow-hidden antialiased font-sans ${
      isDarkMode ? 'bg-[#000000] text-gray-250 dark' : 'bg-white text-gray-800'
    }`} id="app-root">
      {/* COLUMN 1: Left Compact Rail */}
      <AppRail 
        activeView={activeTab}
        setActiveView={(tab) => {
          setActiveTab(tab);
        }}
        pendingNotificationsCount={activeTasksCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onSignout={handleSignout}
        currentUser={currentUser}
      />

      {/* COLUMN 2: Middle Content Sidebar navigation */}
      <ContentSidebar 
        members={members}
        onSelectSpaceFolder={(folder) => {
          setSelectedFolder(folder);
          // Auto switch to tasks tab when folders are selected
          if (activeTab === 'chat' || activeTab === 'customers' || activeTab === 'admin') {
            setActiveTab('tasks');
          }
        }}
        selectedFolder={selectedFolder}
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* COLUMN 3: Right Workstation Panel (Header + Main content card view) */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative ${
        isDarkMode ? 'bg-[#000000]' : 'bg-[#f8f9fa]'
      }`}>
        
        {/* Workspace Title & Toolbar Tabs navigation header */}
        <WorkspaceHeader 
          selectedFolder={selectedFolder}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          taskCount={tasks.length}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentUser={currentUser}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Workspace Dynamic content area */}
        <main className={`flex-1 overflow-hidden flex flex-col relative border-t ${
          isDarkMode ? 'bg-[#000000] border-gray-850' : 'bg-white border-gray-200'
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              {activeTab === 'tasks' && (
                <TaskView 
                  tasks={tasks}
                  members={members}
                  onAddTask={handleAddTask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  searchTerm={searchTerm}
                  isDarkMode={isDarkMode}
                  currentUser={currentUser}
                  selectedFolder={selectedFolder}
                />
              )}

              {activeTab === 'chat' && (
                <ChatView 
                  messages={messages}
                  members={members}
                  onSendMessage={handleSendMessage}
                />
              )}

              {activeTab === 'schedule' && (
                <ScheduleView 
                  tasks={tasks}
                  members={members}
                  mode="schedule"
                />
              )}

              {activeTab === 'gantt' && (
                <ScheduleView 
                  tasks={tasks}
                  members={members}
                  mode="gantt"
                />
              )}

              {activeTab === 'customers' && (
                <CustomersView 
                  customers={customers}
                  onAddCustomer={handleAddCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPanel 
                  members={members}
                  onAddMember={handleAddMember}
                  onDeleteMember={handleDeleteMember}
                  isDarkMode={isDarkMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
