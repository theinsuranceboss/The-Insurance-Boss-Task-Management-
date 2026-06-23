import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Circle, 
  CheckCircle2, 
  MessageSquare, 
  Lock, 
  AlertCircle, 
  Calendar, 
  Flag, 
  PlusCircle, 
  Trash2, 
  Sparkles,
  Link,
  Paperclip,
  User,
  ExternalLink,
  PlusCircle as AddIcon,
  X,
  Send,
  UserPlus
} from 'lucide-react';
import { Task, TaskStatus, Priority, Member, CommentItem } from '../types';

interface TaskViewProps {
  tasks: Task[];
  members: Member[];
  onAddTask: (
    title: string, 
    status: TaskStatus, 
    priority: Priority, 
    assigneeIds: string[],
    month?: string,
    week?: string,
    typeOfPost?: string,
    socialMedia?: string,
    url?: string,
    description?: string,
    isDaily?: boolean,
    folderName?: string,
    attachments?: { name: string; url: string }[],
    dueDate?: string
  ) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  searchTerm: string;
  isDarkMode: boolean;
  currentUser: { id: string; name: string; avatar: string; role: 'admin' | 'user' } | null;
  selectedFolder?: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
const POST_TYPES = ['AnimatedVideo', 'StaticImg', 'Life Insurance', 'Consultation', 'Carousal', 'None'];
const SOCIAL_MEDIA_PLATFORMS = ['Instagram/Facebook', 'LinkedIn', 'YouTube', 'TikTok', 'None'];
const STATUSES: TaskStatus[] = ['PENDING', 'IN PROGRESS', 'IN REVIEW', 'APPROVED', 'SCHEDULED', 'POSTED'];

export const TaskView: React.FC<TaskViewProps> = ({
  tasks,
  members,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTask,
  onDeleteTask,
  searchTerm,
  isDarkMode,
  currentUser,
  selectedFolder = 'Campaigns'
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'PENDING': false,
    'IN PROGRESS': false,
    'IN REVIEW': false,
    'APPROVED': false,
    'SCHEDULED': false,
    'POSTED': false,
  });

  // Selected task for sidepeek details
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Quick addition fields
  const [addingToStatus, setAddingToStatus] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskIsDaily, setNewTaskIsDaily] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('NORMAL');
  const [newTaskMonth, setNewTaskMonth] = useState('April');
  const [newTaskWeek, setNewTaskWeek] = useState('Week 1');
  const [newTaskPostType, setNewTaskPostType] = useState('AnimatedVideo');
  const [newTaskSocial, setNewTaskSocial] = useState('Instagram/Facebook');
  const [newTaskAssignees, setNewTaskAssignees] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-04-30');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('PENDING');

  // Attachments builder state
  const [formAttachments, setFormAttachments] = useState<{ name: string; url: string }[]>([]);
  const [tempAttachName, setTempAttachName] = useState('');
  const [tempAttachUrl, setTempAttachUrl] = useState('');

  // Comment draft for details peek
  const [commentText, setCommentText] = useState('');
  const [selectedTagMember, setSelectedTagMember] = useState('');

  // Attachment additions in details modal
  const [attachName, setAttachName] = useState('');
  const [attachUrl, setAttachUrl] = useState('');

  const toggleGroup = (status: string) => {
    setCollapsedGroups(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const submitNewTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(
        newTaskTitle.trim(), 
        newTaskStatus, 
        newTaskPriority,
        newTaskAssignees,
        newTaskMonth,
        newTaskWeek,
        newTaskPostType,
        newTaskSocial,
        newUrl.trim(),
        newTaskDescription.trim(),
        newTaskIsDaily,
        selectedFolder,
        formAttachments,
        newTaskDueDate
      );
      setAddingToStatus(null);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskIsDaily(false);
      setNewUrl('');
      setFormAttachments([]);
      setTempAttachName('');
      setTempAttachUrl('');
      setNewTaskPriority('NORMAL');
      setNewTaskAssignees([]);
    }
  };

  // Process comments to highlight tagged users in yellow
  const renderFormattedComment = (text: string) => {
    if (!text) return '';
    
    // Find words starting with @
    const words = text.split(' ');
    return words.map((word, i) => {
      if (word.startsWith('@')) {
        // Find if this is a real user name or part
        const cleanName = word.substring(1).replace(/[.,;:!?]/g, '');
        return (
          <span key={i} className="bg-[#FAC000] text-black px-1.5 py-0.5 rounded-full font-extrabold text-[10px] mx-0.5 inline-block shadow-sm">
            @{cleanName}
          </span>
        );
      }
      return <span key={i}>{word} </span>;
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-500 fill-red-100';
      case 'HIGH': return 'text-amber-500 fill-amber-100';
      case 'NORMAL': return 'text-blue-500 fill-blue-100';
      case 'LOW': return 'text-gray-400 fill-gray-50';
      default: return 'text-slate-350';
    }
  };

  const getStatusTheme = (status: TaskStatus) => {
    switch (status) {
      case 'POSTED': return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400',
        labelBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
        dot: 'bg-emerald-500'
      };
      case 'SCHEDULED': return {
        bg: 'bg-fuchsia-600',
        text: 'text-fuchsia-400',
        labelBg: 'bg-fuchsia-600/10 text-fuchsia-400 border-fuchsia-500/20',
        dot: 'bg-fuchsia-600'
      };
      case 'APPROVED': return {
        bg: 'bg-teal-500',
        text: 'text-teal-400',
        labelBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
        dot: 'bg-teal-500'
      };
      case 'IN REVIEW': return {
        bg: 'bg-pink-600',
        text: 'text-pink-400',
        labelBg: 'bg-pink-600/10 text-pink-400 border-pink-500/20',
        dot: 'bg-pink-600'
      };
      case 'IN PROGRESS': return {
        bg: 'bg-blue-500',
        text: 'text-blue-400',
        labelBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        dot: 'bg-blue-500'
      };
      case 'PENDING': return {
        bg: 'bg-amber-500',
        text: 'text-amber-400',
        labelBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500'
      };
      default: return {
        bg: 'bg-gray-500',
        text: 'text-gray-400',
        labelBg: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        dot: 'bg-gray-500'
      };
    }
  };

  // Filter tasks based on selected project folder and Search keywords
  const filteredTasks = tasks.filter(task => {
    const taskFolder = task.folderName || 'Campaigns';
    const folderMatches = taskFolder.toLowerCase() === selectedFolder.toLowerCase();
    if (!folderMatches) return false;

    if (!searchTerm) return true;
    return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (task.month && task.month.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (task.typeOfPost && task.typeOfPost.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (task.socialMedia && task.socialMedia.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(t => t.status === status);
  };

  const handleTaskCellChange = (taskId: string, field: keyof Task, value: any) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const upTask = { ...t, [field]: value };
        if (selectedTask?.id === taskId) {
          setSelectedTask(upTask);
        }
        return upTask;
      }
      return t;
    });
    // Find the original task object
    const original = updated.find(t => t.id === taskId);
    if (original) {
      onUpdateTask(original);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedTask) return;

    const senderName = currentUser ? currentUser.name : 'Unknown User';
    const senderAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      senderName,
      senderAvatar,
      content: commentText,
      timestamp: 'Ahora'
    };

    const updatedTask = {
      ...selectedTask,
      commentsList: [...(selectedTask.commentsList || []), newComment],
      commentCount: (selectedTask.commentCount || 0) + 1
    };

    setSelectedTask(updatedTask);
    onUpdateTask(updatedTask);
    setCommentText('');
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachName.trim() || !selectedTask) return;

    const newAttach = {
      name: attachName.trim(),
      url: attachUrl.trim() || '#'
    };

    const updatedTask = {
      ...selectedTask,
      attachments: [...(selectedTask.attachments || []), newAttach]
    };

    setSelectedTask(updatedTask);
    onUpdateTask(updatedTask);
    setAttachName('');
    setAttachUrl('');
  };

  const handleAppendTag = (memberName: string) => {
    setCommentText(prev => prev + ` @${memberName} `);
  };

  return (
    <div className={`flex-1 flex overflow-hidden ${
      isDarkMode ? 'bg-[#000000]' : 'bg-white'
    }`} id="tasks-view-root">
      {/* LEFT PORTION: Task Hierarchy List of Rows */}
      <div className="flex-1 overflow-y-auto p-4 shrink-0 min-w-0 flex flex-col">
        
        {/* Daily Tasks Checklist Widget */}
        <div className={`p-4 rounded-xl border mb-6 relative overflow-hidden transition-all ${
          isDarkMode 
            ? 'bg-[#050505] border-yellow-500/20 text-white shadow-[0_0_15px_rgba(250,192,0,0.02)]' 
            : 'bg-[#FAC000]/5 border-yellow-200 text-gray-850 shadow-sm'
        }`} id="daily-checklist-container">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#FAC000]/10 flex items-center justify-center text-sm border border-[#FAC000]/20">☀️</span>
              <div>
                <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider">Today's Daily Tasks — {selectedFolder}</h3>
                <p className="text-[10px] text-gray-400 font-medium">Daily recurring campaigns and social schedules for consistent brand presence</p>
              </div>
            </div>
            <span className="text-[9px] bg-[#FAC000]/15 text-[#FAC000] px-2.5 py-0.5 rounded-full font-black border border-[#FAC000]/30 uppercase font-mono tracking-wider">
              {tasks.filter(t => t.isDaily && (t.folderName || 'Campaigns').toLowerCase() === selectedFolder.toLowerCase()).length} ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.filter(t => t.isDaily && (t.folderName || 'Campaigns').toLowerCase() === selectedFolder.toLowerCase()).map((task) => {
              const theme = getStatusTheme(task.status);
              return (
                <div 
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                    isDarkMode 
                      ? 'bg-[#0b0c10] border-[#1f2129] hover:border-[#FAC000]/30 hover:bg-[#121316]' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, task.status === 'POSTED' ? 'PENDING' : 'POSTED')}
                      className="cursor-pointer text-gray-400 hover:text-[#FAC000] shrink-0 outline-none transition-transform active:scale-95 animate-transition"
                    >
                      {task.status === 'POSTED' ? (
                        <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="w-[18px] h-[18px] text-gray-700 hover:text-[#FAC000]" />
                      )}
                    </button>
                    {/* Title */}
                    <div className="flex flex-col min-w-0">
                      <span 
                        onClick={() => setSelectedTask(task)}
                        className={`text-xs font-black truncate hover:underline cursor-pointer ${
                          task.status === 'POSTED' ? 'text-gray-500 line-through' : 'text-white font-extrabold'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-[10px] text-gray-500 truncate mt-0.5">{task.description}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {/* Status dropdown to swap groups */}
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded border focus:outline-none cursor-pointer uppercase ${theme.labelBg}`}
                    >
                      {STATUSES.map(st => (
                        <option key={st} value={st} className="bg-[#121319] text-white font-bold">{st}</option>
                      ))}
                    </select>

                    {/* Member Assignee badge */}
                    {task.assigneeIds && task.assigneeIds[0] && (
                      <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-gray-950">
                        <img 
                          src={members.find(m => m.id === task.assigneeIds[0])?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"} 
                          alt="member" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {tasks.filter(t => t.isDaily && (t.folderName || 'Campaigns').toLowerCase() === selectedFolder.toLowerCase()).length === 0 && (
              <div className="col-span-1 md:col-span-2 py-8 text-center text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl bg-black/45 animate-fadeIn">
                No active daily checklist tasks for Project: <b className="text-[#FAC000]">{selectedFolder}</b>. Add or mark tasks as daily below.
              </div>
            )}
          </div>
        </div>

        {/* Table Column Grid Headers */}
        <div className={`grid grid-cols-12 px-3 py-2 text-[10px] font-black tracking-wider uppercase mb-2 sticky top-0 z-10 select-none pb-2.5 border-b ${
          isDarkMode 
            ? 'bg-black/85 backdrop-blur-md text-gray-500 border-gray-900' 
            : 'bg-white/95 backdrop-blur-md text-gray-400 border-[#f1f3f5]'
        }`}>
          <div className="col-span-4 flex items-center gap-2">
            <span>Task Title / Topic Caption</span>
          </div>
          <div className="col-span-1 text-center">Due Date</div>
          <div className="col-span-1 text-center font-bold">Messages</div>
          <div className="col-span-1 text-center">Month Plan</div>
          <div className="col-span-1 text-center">Week</div>
          <div className="col-span-2 text-center">Post Type</div>
          <div className="col-span-2 text-center text-right pr-6">Social Platform</div>
        </div>

        {/* Sections for Status checkup */}
        {STATUSES.map((status) => {
          const groupTasks = getTasksByStatus(status);
          const count = groupTasks.length;
          const isCollapsed = collapsedGroups[status];
          const theme = getStatusTheme(status);

          return (
            <div key={status} className="mb-4">
              {/* Accordion Group title trigger bar */}
              <div 
                className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer select-none transition-colors border ${
                  isDarkMode 
                    ? 'bg-[#181a25]/60 hover:bg-[#181a25]/90 border-gray-900/50' 
                    : 'bg-gray-50 hover:bg-gray-100/70 border-gray-100'
                }`}
                onClick={() => toggleGroup(status)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-gray-500">
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                  {/* Status badge and metadata */}
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded border flex items-center gap-1.5 whitespace-nowrap ${theme.labelBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                    <span>{status}</span>
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 rounded-full border ${
                    isDarkMode ? 'bg-[#0f111a] border-gray-800 text-gray-550' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddingToStatus(status);
                    setNewTaskStatus(status);
                  }}
                  className="text-gray-500 hover:text-[#FAC000] p-0.5 duration-150 rounded cursor-pointer border-none shadow-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task list matching rows */}
              {!isCollapsed && (
                <div className="mt-1 flex flex-col gap-1.5 pl-1.5">
                  {/* Inline rapid creation form */}
                  {addingToStatus === status && (
                    <div className={`p-4 rounded-xl border-2 border-dashed space-y-4 animate-fadeIn ${
                      isDarkMode ? 'bg-[#000000] border-[#FAC000]/40' : 'bg-yellow-50/10 border-[#FAC000]/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#FAC000] uppercase tracking-wider">Create New Campaign Desk Task</span>
                        <button onClick={() => setAddingToStatus(null)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Content/Task Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. We Can Protect Your Business"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className={`w-full text-xs px-3 py-2 rounded border focus:outline-none focus:border-[#FAC000] font-semibold ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">URL / Link del Portal</label>
                          <input
                            type="text"
                            placeholder="theinsuranceboss.com/page..."
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className={`w-full text-xs px-3 py-2 rounded border focus:outline-none focus:border-[#FAC000] ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Caption/Description textarea */}
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Description / Caption Brief</label>
                        <textarea
                          placeholder="Write key guidelines, draft tags or caption description for the campaign details..."
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          rows={2}
                          className={`w-full text-xs px-3 py-2 rounded border focus:outline-none focus:border-[#FAC000] ${
                            isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">State Status Group</label>
                          <select
                            value={newTaskStatus}
                            onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          >
                            {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Priority Desk</label>
                          <select
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-805'
                            }`}
                          >
                            <option value="NONE">None</option>
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1 font-black">Due Date</label>
                          <input
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Assignee Colleague</label>
                          <select
                            value={newTaskAssignees[0] || ''}
                            onChange={(e) => setNewTaskAssignees(e.target.value ? [e.target.value] : [])}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-900'
                            }`}
                          >
                            <option value="">Unassigned</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Mes Plan (Month)</label>
                          <select
                            value={newTaskMonth}
                            onChange={(e) => setNewTaskMonth(e.target.value)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          >
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Semana (Week)</label>
                          <select
                            value={newTaskWeek}
                            onChange={(e) => setNewTaskWeek(e.target.value)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          >
                            {WEEKS.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Tipo de Post</label>
                          <select
                            value={newTaskPostType}
                            onChange={(e) => setNewTaskPostType(e.target.value)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          >
                            {POST_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Red Social</label>
                          <select
                            value={newTaskSocial}
                            onChange={(e) => setNewTaskSocial(e.target.value)}
                            className={`w-full text-xs p-1.5 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          >
                            {SOCIAL_MEDIA_PLATFORMS.map(sm => <option key={sm} value={sm}>{sm}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* File upload / link attachment builder */}
                      <div className="p-3 bg-black/40 border border-gray-850 rounded-lg space-y-2">
                        <span className="block text-[10px] uppercase font-bold text-[#FAC000] tracking-wider">Attach Graphics, Media & External Files</span>
                        {formAttachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 pb-1 bg-black/50 p-2 rounded border border-gray-900">
                            {formAttachments.map((f, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#FAC000]/10 border border-[#FAC000]/30 text-[#FAC000] px-2 py-0.5 rounded font-black">
                                <Paperclip className="w-3 h-3 text-[#FAC000]" />
                                <span className="truncate max-w-[120px]">{f.name}</span>
                                <button
                                  type="button"
                                  onClick={() => setFormAttachments(prev => prev.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-650 font-bold ml-1 text-[11px] shrink-0 border-none bg-transparent cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="File name or short label..."
                            value={tempAttachName}
                            onChange={(e) => setTempAttachName(e.target.value)}
                            className={`flex-1 text-xs px-2 py-1 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Link (e.g. Canva URL, Google Drive file, Figma...)"
                            value={tempAttachUrl}
                            onChange={(e) => setTempAttachUrl(e.target.value)}
                            className={`flex-1 text-xs px-2 py-1 rounded border focus:outline-none ${
                              isDarkMode ? 'bg-[#0a0a0c] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (tempAttachName.trim()) {
                                setFormAttachments(prev => [...prev, { name: tempAttachName.trim(), url: tempAttachUrl.trim() || '#' }]);
                                setTempAttachName('');
                                setTempAttachUrl('');
                              }
                            }}
                            className="bg-[#FAC000]/20 hover:bg-[#FAC000] text-[#FAC000] hover:text-[#090a0f] text-xs font-black px-3 py-1 rounded border border-[#FAC000]/30 duration-150 cursor-pointer shrink-0"
                          >
                            + Attach
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Daily task toggle */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="quick-daily-check"
                            checked={newTaskIsDaily}
                            onChange={(e) => setNewTaskIsDaily(e.target.checked)}
                            className="w-4 h-4 accent-[#FAC000] cursor-pointer text-[#FAC000]"
                          />
                          <label htmlFor="quick-daily-check" className="text-xs font-bold text-gray-400 cursor-pointer">
                            Mark as Daily Campaign Task (☀️)
                          </label>
                        </div>

                        <div className="flex justify-end gap-2.5">
                          <button 
                            type="button"
                            onClick={() => setAddingToStatus(null)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-500/10 hover:text-red-400 border border-transparent ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => submitNewTask()}
                            className="px-4 py-1.5 bg-[#FAC000] hover:bg-[#e0ab00] text-[#090a0f] text-xs font-black rounded-lg transition-colors cursor-pointer"
                          >
                            Create Post Task +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tasks List rows */}
                  {groupTasks.map((task) => {
                    const commentsCount = task.commentsList?.length || task.commentCount || 0;
                    return (
                      <div 
                        key={task.id} 
                        className={`grid grid-cols-12 items-center px-3 py-2.5 rounded-xl border transition-all relative ${
                          selectedTask?.id === task.id
                            ? isDarkMode ? 'bg-[#FAC000]/10 border-[#FAC000]/50' : 'bg-yellow-50/55 border-[#FAC000]/70'
                            : isDarkMode 
                              ? 'bg-[#0a0a0c] border-[#181a20] hover:bg-[#121316] hover:border-gray-700' 
                              : 'bg-white border-[#f1f3f5] hover:border-[#FAC000]/40'
                        }`}
                      >
                        {/* Task Title check button & triggers */}
                        <div className="col-span-4 flex items-center gap-2.5 min-w-0 pr-2">
                          {/* Checkbox trigger to toggle status */}
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, task.status === 'POSTED' ? 'PENDING' : 'POSTED')}
                            className="cursor-pointer text-gray-500 hover:text-[#FAC000] transition-colors shrink-0 outline-none"
                            id={`checkbox-${task.id}`}
                          >
                            {task.status === 'POSTED' ? (
                              <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500 fill-emerald-500/10" />
                            ) : (
                              <Circle className="w-[18px] h-[18px] text-gray-700 hover:text-[#FAC000]" />
                            )}
                          </button>

                          {/* Paperclip attachment indicator */}
                          {(task.attachments && task.attachments.length > 0) && (
                            <span className="p-1 rounded bg-[#FAC000]/10 text-[#FAC000] shrink-0 font-bold" title="Has attachments">
                              <Paperclip className="w-3 h-3 text-[#FAC000]" />
                            </span>
                          )}

                          {/* Quick inline status dropdown selector */}
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className={`text-[9px] font-black tracking-tight px-1 py-0.5 rounded border focus:outline-none shrink-0 uppercase cursor-pointer ${
                              getStatusTheme(task.status).labelBg
                            }`}
                          >
                            {STATUSES.map(st => (
                              <option key={st} value={st} className="bg-[#121319] text-white font-bold">{st}</option>
                            ))}
                          </select>

                          {/* Task Text Title click to sidepeek */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span 
                              onClick={() => setSelectedTask(task)}
                              className={`text-[12.5px] font-black truncate cursor-pointer hover:underline ${
                                task.status === 'POSTED' ? 'text-gray-550 line-through' : 'text-white font-extrabold text-shadow-sm'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <span className="text-[10px] text-gray-500 truncate">{task.description}</span>
                            )}
                          </div>
                        </div>

                        {/* Due Date field */}
                        <div className="col-span-1 text-center text-xs">
                          {task.dueDate ? (
                            <span 
                              onClick={() => setSelectedTask(task)}
                              className="inline-flex items-center gap-1 text-[10.5px] bg-[#1d202e] border border-gray-800 rounded px-1.5 py-0.5 text-gray-400 font-bold cursor-pointer hover:border-gray-600"
                            >
                              <Calendar className="w-2.5 h-2.5 text-[#FAC000]" />
                              {task.dueDate.replace('2026-', '')}
                            </span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </div>

                        {/* Comments button indicator columns */}
                        <div className="col-span-1 text-center">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-all cursor-pointer ${
                              commentsCount > 0 
                                ? 'bg-[#FAC000]/15 text-[#FAC000] font-black border border-[#FAC000]/25' 
                                : 'text-gray-500 hover:text-white'
                            }`}
                            title="Comentarios y menciones"
                          >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            {commentsCount > 0 && <span className="font-mono">{commentsCount}</span>}
                          </button>
                        </div>

                        {/* Month select column */}
                        <div className="col-span-1 px-1">
                          <select
                            value={task.month || 'April'}
                            onChange={(e) => handleTaskCellChange(task.id, 'month', e.target.value)}
                            className={`w-full text-[11px] font-bold p-1 rounded border overflow-hidden truncate outline-none transition-all cursor-pointer ${
                              isDarkMode 
                                ? 'bg-[#1b1c25] border-gray-800/80 text-yellow-405 focus:border-[#FAC000]' 
                                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                            }`}
                          >
                            {MONTHS.map(m => (
                              <option key={m} value={m} className="bg-[#121319] text-white font-semibold">
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Weekly week switcher */}
                        <div className="col-span-1 px-1 text-center">
                          <select
                            value={task.week || 'Week 1'}
                            onChange={(e) => handleTaskCellChange(task.id, 'week', e.target.value)}
                            className={`w-full text-[11px] font-bold py-1 px-0.5 rounded border outline-none text-center cursor-pointer ${
                              isDarkMode 
                                ? 'bg-[#1b1c25] border-gray-800/80 text-white focus:border-[#FAC000]' 
                                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                            }`}
                          >
                            {WEEKS.map(w => (
                              <option key={w} value={w} className="bg-[#121319] text-white">
                                {w}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Type of Post switcher */}
                        <div className="col-span-2 px-1">
                          <select
                            value={task.typeOfPost || 'AnimatedVideo'}
                            onChange={(e) => handleTaskCellChange(task.id, 'typeOfPost', e.target.value)}
                            className={`w-full text-[11px] font-black p-1 rounded-md border outline-none transition-all cursor-pointer ${
                              isDarkMode 
                                ? 'bg-indigo-950/40 border-indigo-900/60 text-blue-400 focus:border-[#FAC000] font-bold' 
                                : 'bg-blue-50 border-blue-200 text-blue-800 font-bold'
                            }`}
                          >
                            {POST_TYPES.map(pt => (
                              <option key={pt} value={pt} className="bg-[#121319] text-white font-bold">
                                {pt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Social Media Platform column */}
                        <div className="col-span-2 pl-1.5 pr-2 flex items-center justify-between gap-1.5">
                          <select
                            value={task.socialMedia || 'Instagram/Facebook'}
                            onChange={(e) => handleTaskCellChange(task.id, 'socialMedia', e.target.value)}
                            className={`w-full text-[11px] font-black px-1.5 py-1 rounded-md border outline-none cursor-pointer ${
                              isDarkMode 
                                ? 'bg-pink-950/20 border-pink-905/40 text-pink-400 font-bold' 
                                : 'bg-pink-50 border-pink-200 text-pink-805 font-bold'
                            }`}
                          >
                            {SOCIAL_MEDIA_PLATFORMS.map(sm => (
                              <option key={sm} value={sm} className="bg-[#121319] text-white font-bold">
                                {sm}
                              </option>
                            ))}
                          </select>

                          {/* Row Trash delete button */}
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-gray-500 hover:text-red-400 duration-150 rounded cursor-pointer shrink-0"
                            title="Eliminar tarea"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDEPEEK: Details Slideout layout with tag mentions comments */}
      {selectedTask && (
        <div className={`w-[450px] border-l h-full shrink-0 flex flex-col relative animate-slideIn ${
          isDarkMode ? 'bg-[#0f111a] border-gray-900 text-[#e4e4e9]' : 'bg-gray-50 border-gray-250 text-gray-800'
        }`} id="task-detail-sidepeek">
          {/* Header toolbar */}
          <div className="p-4 border-b border-gray-900/80 flex items-center justify-between bg-black/15">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-yellow-500/10 text-[#FAC000] border border-yellow-500/20 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                Content Campaign Details
              </span>
            </div>
            
            <button 
              onClick={() => setSelectedTask(null)}
              className="p-1 bg-black/25 hover:bg-black/45 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Title editable */}
            <div>
              <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Post Title Topic</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => handleTaskCellChange(selectedTask.id, 'title', e.target.value)}
                className={`w-full font-black text-lg focus:outline-none focus:border-b focus:border-[#FAC000] bg-transparent pb-1 transition-all ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              />
            </div>

            {/* Description / Caption notes Section */}
            <div className={`p-4 rounded-xl border space-y-2.5 text-xs ${
              isDarkMode ? 'bg-[#151722]/60 border-gray-900' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Post Description & Captions</h4>
                <span className="text-[9px] text-gray-500">Auto-saved</span>
              </div>
              <textarea
                value={selectedTask.description || ''}
                onChange={(e) => handleTaskCellChange(selectedTask.id, 'description', e.target.value)}
                placeholder="Write the Instagram copy, hashtags, or specific references for this social asset..."
                rows={4}
                className={`w-full text-xs p-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#FAC000] transition-all resize-none ${
                  isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 border-transparent'
                }`}
              />
            </div>

            {/* Content Details Grid */}
            <div className={`p-4 rounded-xl border space-y-3.5 text-xs ${
              isDarkMode ? 'bg-[#151722]/60 border-gray-900' : 'bg-white border-gray-200'
            }`}>
              <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Post Metadata</h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Month Picker */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Plan Month</label>
                  <select
                    value={selectedTask.month || 'April'}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'month', e.target.value)}
                    className={`w-full p-2 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-850 border-transparent'
                    }`}
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Week Picker */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Plan Week</label>
                  <select
                    value={selectedTask.week || 'Week 1'}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'week', e.target.value)}
                    className={`w-full p-2 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-850 border-transparent'
                    }`}
                  >
                    {WEEKS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                {/* Type of Post Picker */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Post Type format</label>
                  <select
                    value={selectedTask.typeOfPost || 'AnimatedVideo'}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'typeOfPost', e.target.value)}
                    className={`w-full p-2 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-855'
                    }`}
                  >
                    {POST_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>

                {/* Social Media Platform column */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Destination Social Channel</label>
                  <select
                    value={selectedTask.socialMedia || 'Instagram/Facebook'}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'socialMedia', e.target.value)}
                    className={`w-full p-2 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-855'
                    }`}
                  >
                    {SOCIAL_MEDIA_PLATFORMS.map(sm => <option key={sm} value={sm}>{sm}</option>)}
                  </select>
                </div>

                {/* Due Date String */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Calendar Due Date</label>
                  <input
                    type="date"
                    value={selectedTask.dueDate || '2026-04-15'}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'dueDate', e.target.value)}
                    className={`w-full p-1.5 rounded outline-none text-xs font-semibold ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 border-transparent'
                    }`}
                  />
                </div>

                {/* Assignees Column */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Assignee Colleague</label>
                  <select
                    value={selectedTask.assigneeIds && selectedTask.assigneeIds[0]}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'assigneeIds', [e.target.value])}
                    className={`w-full p-2 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 border-transparent'
                    }`}
                  >
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                {/* Daily Switch toggle inside metadata block */}
                <div className="col-span-2 flex items-center justify-between pt-3 border-t border-gray-800/40">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">☀️</span>
                    <div>
                      <span className="block text-[11px] font-bold">Daily Routine Planner</span>
                      <span className="block text-[9px] text-gray-500">Flags this post to appear on today's schedule</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!selectedTask.isDaily}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'isDaily', e.target.checked)}
                    className="w-4 h-4 accent-[#FAC000] cursor-pointer"
                  />
                </div>
              </div>

              {/* URL/Links line */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Campaign Web Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedTask.url || ''}
                    onChange={(e) => handleTaskCellChange(selectedTask.id, 'url', e.target.value)}
                    placeholder="https://theinsuranceboss.com/my-post"
                    className={`flex-1 text-xs px-2.5 py-1.5 rounded outline-none ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 border-transparent'
                    }`}
                  />
                  {selectedTask.url && (
                    <a
                      href={selectedTask.url.startsWith('http') ? selectedTask.url : `https://${selectedTask.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#FAC000]/10 text-[#FAC000] border border-[#FAC000]/35 rounded text-xs font-bold inline-flex items-center gap-1 hover:bg-[#FAC000] hover:text-black transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
                    {/* COLLABORATIVE ATTACHMENTS & LINKS */}
            <div className={`p-4 rounded-xl border space-y-3.5 text-xs ${
              isDarkMode ? 'bg-[#151722]/60 border-gray-900' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#FAC000]" />
                  <span>Attachments & Graphic Links</span>
                </h4>
                <span className="text-[10px] text-gray-500">Asset Bank</span>
              </div>

              {/* Render existing attachments */}
              {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                <div className="space-y-2">
                  {selectedTask.attachments.map((at, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-black/30 border border-gray-800 text-[11px]">
                      <span className="font-bold text-[#FAC000] truncate max-w-[200px] flex items-center gap-1.5">
                        <Link className="w-3 h-3 text-gray-500 shrink-0" />
                        {at.name}
                      </span>
                      <div className="flex gap-2.5">
                        <a 
                          href={at.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#FAC000] hover:underline text-[10px] font-bold"
                        >
                          Open Asset
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = selectedTask.attachments?.filter((_, i) => i !== idx) || [];
                            const updatedTask = { ...selectedTask, attachments: filtered };
                            setSelectedTask(updatedTask);
                            onUpdateTask(updatedTask);
                          }}
                          className="text-red-400 hover:text-red-600 bg-none border-none p-0 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-650 italic">No assets or campaign graphic attachments linked yet.</p>
              )}

              {/* Form to submit attachment */}
              <form onSubmit={handleAddAttachment} className="pt-2 border-t border-gray-800/40 space-y-2">
                <span className="block text-[9px] uppercase font-bold text-gray-500">Add New Connected Asset</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Attachment label (e.g. Canva Banner)..."
                    value={attachName}
                    onChange={(e) => setAttachName(e.target.value)}
                    className={`p-1.5 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 border-transparent'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="URL address/link..."
                    value={attachUrl}
                    onChange={(e) => setAttachUrl(e.target.value)}
                    className={`p-1.5 rounded outline-none text-xs ${
                      isDarkMode ? 'bg-[#1c1d29] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 border-transparent'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black/45 hover:bg-[#FAC000] hover:text-[#090a0f] text-[#FAC000] border border-[#FAC000]/30 hover:border-transparent text-[11px] font-black py-2 rounded transition-all cursor-pointer"
                >
                  Link Graphic Asset +
                </button>
              </form>
            </div>

            {/* MENTION COMMENTS THREAD WITH TAGGING HELPERS */}
            <div className={`p-4 rounded-xl border space-y-3.5 text-xs ${
              isDarkMode ? 'bg-[#151722]/60 border-gray-900' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FAC000]" />
                  <span>Team Comments & @Mentions</span>
                </h4>
                <span className="text-[9px] bg-yellow-500/10 text-[#FAC000] border border-yellow-500/25 px-1.5 py-0.2 rounded font-mono font-bold">
                  Sync
                </span>
              </div>

              {/* Tag Selection Helper dropdown toolbar */}
              <div className="pt-1.5 pb-2 border-b border-gray-900/40">
                <span className="block text-[9px] uppercase font-extrabold text-[#FAC000] tracking-wider mb-2">
                  Direct Tag Colleague:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {members.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleAppendTag(member.name)}
                      className="inline-flex items-center gap-1 bg-black/40 hover:bg-[#FAC000] hover:text-black py-1 px-2.5 rounded-full border border-gray-800 text-[10px] font-bold cursor-pointer transition-all duration-150"
                    >
                      <UserPlus className="w-2.5 h-2.5" />
                      <span>{member.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments representation */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {selectedTask.commentsList && selectedTask.commentsList.length > 0 ? (
                  selectedTask.commentsList.map((comm) => (
                    <div key={comm.id} className="flex gap-2.5 items-start p-2 rounded bg-black/10 border border-gray-800/20">
                      <img src={comm.senderAvatar} alt={comm.senderName} className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-850" referrerPolicy="no-referrer" />
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white">{comm.senderName}</span>
                          <span className="text-[9px] text-gray-500">{comm.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed break-words text-gray-300">
                          {renderFormattedComment(comm.content)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-600 italic">No notes written. Tag someone with @Colleague or utilize shortcuts above.</p>
                )}
              </div>

              {/* Comment submission form */}
              <div className="pt-2 border-t border-gray-800/40 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or comment, e.g. @Dean P. review copy..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                  className={`flex-1 text-xs px-2.5 py-1.5 rounded outline-none transition-all ${
                    isDarkMode ? 'bg-[#1c1d29] focus:border-[#FAC000] text-white border border-gray-800' : 'bg-gray-100 text-gray-800 focus:border-[#FAC000] border-transparent'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="p-1.5 rounded bg-[#FAC000] hover:bg-[#e0ab00] disabled:opacity-40 text-black cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>          </div>
          </div>
        </div>
      )}
    </div>
  );
};
