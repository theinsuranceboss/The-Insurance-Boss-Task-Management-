import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, Hash, AlertCircle } from 'lucide-react';
import { ChatMessage, Member } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  members: Member[];
  onSendMessage: (text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  members,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const getMemberDetails = (senderId: string) => {
    return members.find(m => m.id === senderId);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden font-sans bg-white select-none" id="chat-view">
      {/* Messages Column (Left / Main) */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {/* Chat Space Info Header */}
        <div className="px-4 py-2.5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-500" />
            <span className="font-semibold text-xs text-gray-800"># marketing-space-chat</span>
            <span className="text-[10px] text-gray-400 font-medium">Public Channel for campaigns & assets</span>
          </div>
          <div className="flex items-center -space-x-1">
            {members.slice(0, 3).map((m) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
                referrerPolicy="no-referrer"
              />
            ))}
            <span className="w-5 h-5 bg-gray-100/80 text-[9px] text-gray-500 rounded-full border border-white flex items-center justify-center font-bold">
              +{members.length - 3}
            </span>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-2 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-normal">
              Welcome to the replica **Marketing Space Chat** channel! Type messages to see immediate simulated replies from team associates.
            </p>
          </div>

          {messages.map((msg) => {
            const member = getMemberDetails(msg.senderId);
            const avatar = member?.avatar || msg.senderAvatar;
            const senderName = member?.name || msg.senderName;
            const color = member?.color || msg.senderColor;

            return (
              <div 
                key={msg.id} 
                className="flex gap-3 items-start"
              >
                {/* User avatar */}
                {avatar ? (
                  <img
                    src={avatar}
                    alt={senderName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${color}`}>
                    {senderName[0]}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-bold text-gray-800">{senderName}</span>
                    <span className="text-[9px] text-gray-400 font-light">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-normal break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Chat input section */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white sticky bottom-0 shrink-0">
          <div className="flex items-center gap-2 border border-gray-250 hover:border-gray-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-100 rounded-lg p-1 transition-all bg-[#fafbfe]">
            <input
              type="text"
              placeholder="Send message to marketing group..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-1.5 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white cursor-pointer transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Channel Members List Sidebar (Right) */}
      <div className="w-full md:w-48 bg-[#f8f9fa] border-l border-[#e9ecef] p-3 flex flex-col gap-3 shrink-0 hidden md:flex">
        <div className="flex items-center gap-1.5 text-gray-500 pb-2 border-b border-[#e9ecef]">
          <Users className="w-3.5 h-3.5" />
          <span className="text-[10.5px] font-bold tracking-wider uppercase">Active Members</span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-1 hover:bg-white rounded-md transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-5.5 h-5.5 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium text-gray-600 truncate">{m.name}</span>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
