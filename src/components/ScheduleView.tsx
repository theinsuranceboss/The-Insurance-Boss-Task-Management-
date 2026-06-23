import React, { useState } from 'react';
import { 
  Calendar, 
  Milestone, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  Plus, 
  AlertCircle,
  Flag,
  User,
  GitCommit,
  Bot
} from 'lucide-react';
import { Task, Member } from '../types';

interface ScheduleViewProps {
  tasks: Task[];
  members: Member[];
  mode: 'gantt' | 'schedule';
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  tasks,
  members,
  mode
}) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 'ev-1', taskTitle: 'Social campaign publishing', startDay: 1, duration: 2, assigneeId: 'tara', color: 'bg-[#10b981]' },
    { id: 'ev-2', taskTitle: 'Website landing page design', startDay: 2, duration: 3, assigneeId: 'alex', color: 'bg-[#6366f1]' },
    { id: 'ev-3', taskTitle: 'Market Research analysis', startDay: 3, duration: 2, assigneeId: 'dean', color: 'bg-[#0ea5e9]' },
    { id: 'ev-4', taskTitle: 'Competitor Benchmarking sync', startDay: 4, duration: 3, assigneeId: 'zeb', color: 'bg-[#f59e0b]' },
    { id: 'ev-5', taskTitle: 'Brand Positioning document', startDay: 5, duration: 2, assigneeId: 'agent', color: 'bg-[#a855f7]' },
  ]);

  // Week days label helper
  const weekDays = [
    { name: 'Mon', date: 'May 25' },
    { name: 'Tue', date: 'May 26' },
    { name: 'Wed', date: 'May 27' },
    { name: 'Thu', date: 'May 28' },
    { name: 'Fri', date: 'May 29' },
    { name: 'Sat', date: 'May 30' },
    { name: 'Sun', date: 'May 31' },
  ];

  // Map tasks to dates if they match due dates
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(t => t.dueDate === `2026-05-${dateStr.split(' ')[1]}`);
  };

  const adjustEventDuration = (eventId: string, adjustment: number) => {
    setTimelineEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const newDuration = Math.max(1, Math.min(7 - ev.startDay + 1, ev.duration + adjustment));
        return { ...ev, duration: newDuration };
      }
      return ev;
    }));
  };

  const adjustEventStart = (eventId: string, adjustment: number) => {
    setTimelineEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const newStart = Math.max(1, Math.min(7, ev.startDay + adjustment));
        // Clamp duration so it doesn't leak out of the 7 Column Grid
        const clampedDuration = Math.min(7 - newStart + 1, ev.duration);
        return { ...ev, startDay: newStart, duration: clampedDuration };
      }
      return ev;
    }));
  };

  if (mode === 'schedule') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-white overflow-hidden font-sans select-none" id="schedule-planner-module">
        {/* Calendar Nav bar */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-gray-800">Weekly Schedule Planner</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold font-sans">May 25 - May 31, 2026 (Launch Week)</span>
            <div className="flex items-center border border-gray-200 rounded">
              <button 
                onClick={() => setCurrentWeekOffset(prev => prev - 1)} 
                className="p-1 hover:bg-gray-100/80 text-gray-500 cursor-pointer text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setCurrentWeekOffset(prev => prev + 1)} 
                className="p-1 hover:bg-gray-100/80 text-gray-500 cursor-pointer text-xs border-l border-gray-150"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 7 Day horizontal columns block */}
        <div className="flex-1 grid grid-cols-7 gap-2 overflow-y-auto min-h-0">
          {weekDays.map((day, dIdx) => {
            const dateNum = day.date.split(' ')[1];
            // Tasks assigned to this specific date
            const dateTasks = getTasksForDate(day.date);
            const isToday = dIdx === 0 && currentWeekOffset === 0;

            return (
              <div 
                key={day.name} 
                className={`border rounded-lg p-2.5 flex flex-col gap-2 min-h-[220px] transition-all bg-[#fafbfe]/40 ${
                  isToday ? 'border-purple-400 ring-2 ring-purple-50 bg-purple-50/10' : 'border-gray-100'
                }`}
              >
                {/* Header info */}
                <div className="border-b border-gray-100 pb-1.5 shrink-0 flex items-center justify-between select-none">
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{day.name}</h5>
                    <span className="text-xs font-bold text-gray-700">{day.date}</span>
                  </div>
                  {isToday && (
                    <span className="text-[9px] bg-purple-600 text-white font-bold px-1 py-0.2 rounded-full uppercase scale-90">Today</span>
                  )}
                </div>

                {/* Day Tasks List */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
                  {dateTasks.map(task => {
                    const statusColor = task.status === 'DONE' ? 'border-l-2 border-emerald-500 bg-emerald-50/20 text-emerald-800' : 'border-l-2 border-blue-500 bg-blue-50/20 text-blue-800';
                    return (
                      <div 
                        key={task.id} 
                        className={`p-2 rounded text-[10px] font-medium leading-relaxed border border-gray-100 transition-all shadow-none hover:shadow-sm flex flex-col gap-1 cursor-pointer ${statusColor}`}
                      >
                        <div className="flex items-center justify-between font-semibold gap-1">
                          <span className={`${task.status === 'DONE' ? 'line-through text-gray-400' : ''} truncate`}>{task.title}</span>
                          <span className="text-[9px] scale-90 opacity-80 shrink-0 font-bold font-mono">2026</span>
                        </div>

                        {/* Assignee trigger representation */}
                        {task.assigneeIds.length > 0 && (
                          <div className="flex -space-x-1 mt-1">
                            {task.assigneeIds.map(id => {
                              const m = members.find(mbr => mbr.id === id);
                              return m ? (
                                <img 
                                  key={id} 
                                  src={m.avatar} 
                                  alt={m.name} 
                                  className="w-4 h-4 rounded-full object-cover ring-1 ring-white" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {dateTasks.length === 0 && (
                    <div className="h-full flex items-center justify-center border border-dashed border-gray-200/80 rounded-lg p-2.5 text-center text-[10px] text-gray-350 py-10 font-medium">
                      No Task Scheduled
                    </div>
                  )}
                </div>

                <button className="w-full text-center py-1 bg-[#fafbfe] hover:bg-gray-100 text-gray-500 text-[10px] font-semibold rounded cursor-pointer transition-colors border border-gray-150 shadow-none">
                  + Add Event
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Gantt Chart View Rendering (Horizontal scheduling grids layout)
  return (
    <div className="flex-1 flex flex-col p-4 bg-white overflow-hidden font-sans select-none" id="gantt-chart-module">
      {/* Gantt Header */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg shrink-0">
        <div className="flex items-center gap-2">
          <Milestone className="w-4 h-4 text-purple-600 animate-pulse" />
          <h3 className="text-xs font-bold text-gray-800 font-sans">Interactive Gantt Timeline</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-100">
            Sprint Timeline
          </span>
          <span className="text-xs text-gray-400 font-bold font-sans">Schedules can be shifted horizontally</span>
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="flex-1 flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-[#fafbfe]/30 min-h-0">
        {/* Day numbers column list header */}
        <div className="grid grid-cols-12 bg-gray-50 shrink-0 border-b border-gray-150 py-2 text-[11px] font-bold text-gray-400 select-none">
          <div className="col-span-4 px-3">ACTIVE TASK</div>
          <div className="col-span-8 grid grid-cols-7 text-center">
            {weekDays.map(wd => (
              <div key={wd.name} className="border-l border-gray-150 leading-tight">
                <span className="block text-gray-700 tracking-wide">{wd.name}</span>
                <span className="text-[9px] text-gray-450 font-medium">{wd.date.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {timelineEvents.map((ev) => {
            const memberDetails = members.find(m => m.id === ev.assigneeId);
            return (
              <div key={ev.id} className="grid grid-cols-12 items-center py-3.5 hover:bg-white transition-all">
                {/* Left Task title name tag with assignee details */}
                <div className="col-span-4 px-3 flex items-center justify-between gap-1.5 min-w-0 pr-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="text-xs text-gray-700 font-medium truncate">{ev.taskTitle}</span>
                  </div>

                  {/* Move elements buttons for Gantt columns shift controls */}
                  <div className="flex items-center gap-1 shrink-0 bg-gray-100 rounded p-[2px]">
                    <button 
                      onClick={() => adjustEventStart(ev.id, -1)}
                      className="p-0.5 hover:bg-white rounded text-[9px] text-gray-600 transition-colors uppercase font-bold shrink-0 cursor-pointer shadow-none"
                      title="Shift Left (Left Day)"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => adjustEventDuration(ev.id, 1)}
                      className="p-0.5 hover:bg-white rounded text-[9px] text-gray-600 transition-colors uppercase font-bold shrink-0 cursor-pointer shadow-none"
                      title="Expand Duration (Add Day)"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => adjustEventDuration(ev.id, -1)}
                      className="p-0.5 hover:bg-white rounded text-[9px] text-gray-600 transition-colors uppercase font-bold shrink-0 cursor-pointer shadow-none"
                      title="Shrink Duration (Remove Day)"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => adjustEventStart(ev.id, 1)}
                      className="p-0.5 hover:bg-white rounded text-[9px] text-gray-600 transition-colors uppercase font-bold shrink-0 cursor-pointer shadow-none"
                      title="Shift Right (Right Day)"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Right grid bar with columns */}
                <div className="col-span-8 grid grid-cols-7 items-center h-full relative">
                  {/* Absolute Timeline bar floating over corresponding columns */}
                  <div 
                    style={{
                      gridColumnStart: ev.startDay,
                      gridColumnEnd: `span ${ev.duration}`
                    }}
                    className={`h-7 rounded-lg ${ev.color} text-white text-[10.5px] font-semibold flex items-center justify-between px-2 w-full shadow-sm shadow-[#1e2029]/10 relative z-10 transition-all font-sans duration-150 animate-fadeIn`}
                  >
                    <span className="truncate pr-1.5 select-none">{ev.taskTitle}</span>

                    {/* Floating assignee profile avatar */}
                    {memberDetails ? (
                      <div className="relative group shrink-0">
                        <img 
                          className="w-5.5 h-5.5 rounded-full object-cover border border-white/80 select-none cursor-pointer" 
                          src={memberDetails.avatar} 
                          alt={memberDetails.name} 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded px-1.5 py-0.5 z-50 whitespace-nowrap shadow-lg">
                          {memberDetails.name} ({memberDetails.role})
                        </div>
                      </div>
                    ) : (
                      <User className="w-3.5 h-3.5 text-white/70" />
                    )}
                  </div>

                  {/* Thin vertical grid column lines background simulation */}
                  <div className="absolute inset-0 grid grid-cols-7 pointer-events-none text-center">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="border-l border-gray-150 h-full w-[1px] mx-auto opacity-40" />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
