import { createFileRoute, Link } from '@tanstack/react-router';
import { mockChats } from '../mockData';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  LayoutDashboard, 
  ChevronRight, 
  MessageSquare,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/tasks')({
  component: TasksSummary,
});

function TasksSummary() {
  // Use local state to allow interactive toggling in this view
  const [chats, setChats] = useState(mockChats);
  const [activeTab, setActiveTab] = useState<'my' | 'bot'>('my');

  const allTasks = useMemo(() => {
    return chats.flatMap(chat => 
      chat.messages
        .filter(m => m.sender === (activeTab === 'my' ? 'user' : 'bot'))
        .map(m => ({ ...m, chatId: chat.id, chatName: chat.name, chatAvatar: chat.avatar }))
    );
  }, [chats, activeTab]);

  const handleToggleTask = (chatId: string, messageId: string) => {
    const chat = mockChats.find(c => c.id === chatId);
    if (chat) {
      const message = chat.messages.find(m => m.id === messageId);
      if (message) {
        message.isCompleted = !message.isCompleted;
        setChats([...mockChats]);
      }
    }
  };

  const completedTasks = allTasks.filter(m => m.isCompleted);
  const pendingTasks = allTasks.filter(m => !m.isCompleted);
  
  const total = allTasks.length;
  const completed = completedTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const groupedPending = useMemo(() => {
    const groups: Record<string, typeof pendingTasks> = {};
    pendingTasks.forEach(task => {
      if (!groups[task.chatName]) groups[task.chatName] = [];
      groups[task.chatName].push(task);
    });
    return groups;
  }, [pendingTasks]);

  const themeColor = activeTab === 'my' ? '#07c160' : '#3b82f6'; // Green for My, Blue for Bot
  const themeBg = activeTab === 'my' ? 'bg-[#07c160]' : 'bg-blue-500';
  const themeText = activeTab === 'my' ? 'text-[#07c160]' : 'text-blue-500';
  const themeBadge = activeTab === 'my' ? 'bg-[#07c160]/10 text-[#07c160] dark:bg-[#07c160]/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20';

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7] dark:bg-[#111111] font-sans text-[#1a1a1a] dark:text-white">
      <header className="bg-white dark:bg-[#191919] border-b border-gray-100 dark:border-[#222222] sticky top-0 z-20">
        <div className="px-5 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold dark:text-white">任务汇总</h1>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${themeBadge}`}>
                {completed}/{total}
              </span>
            </div>
          </div>
          
          {/* View Switcher */}
          <div className="flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-lg mb-4">
            <button 
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'my' ? `bg-white dark:bg-[#333333] shadow-sm ${themeText}` : 'text-gray-400 dark:text-gray-500'}`}
            >
              我的工作
            </button>
            <button 
              onClick={() => setActiveTab('bot')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'bot' ? `bg-white dark:bg-[#333333] shadow-sm ${themeText}` : 'text-gray-400 dark:text-gray-500'}`}
            >
              机器人工作
            </button>
          </div>
        </div>
        
        <div className="h-1 w-full bg-gray-50 dark:bg-[#222222] overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${themeBg}`}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedPending).map(([chatName, tasks]) => (
              <div key={chatName} className="space-y-2">
                <div className="px-1 flex items-center gap-2">
                  <div className={`w-1 h-3 rounded-full ${themeBg}`} />
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {chatName}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#191919] rounded-xl overflow-hidden shadow-sm border border-gray-50 dark:border-[#222222]">
                  <AnimatePresence mode="popLayout">
                    {tasks.map((task, idx) => (
                      <motion.div 
                        layout
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 flex items-start gap-3 ${idx !== tasks.length - 1 ? 'border-b border-gray-50 dark:border-[#222222]' : ''}`}
                      >
                        <button 
                          onClick={() => handleToggleTask(task.chatId, task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${activeTab === 'bot' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-500' : 'border-gray-200 dark:border-gray-700 text-transparent hover:border-[#07c160] hover:text-[#07c160]'}`}
                        >
                          <CheckCircle2 size={12} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200 leading-snug">{task.text}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                              {new Date(task.timestamp).toLocaleDateString()}
                            </span>
                            <Link 
                              to="/chat/$chatId" 
                              params={{ chatId: task.chatId }}
                              className={`text-[11px] font-medium flex items-center gap-0.5 ${themeText}`}
                            >
                              详情 <ChevronRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-[#191919] rounded-full flex items-center justify-center shadow-sm mb-4">
              <CheckCircle2 size={24} className="text-gray-200 dark:text-gray-800" />
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">暂无待处理任务</p>
          </div>
        )}

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="px-1">
              <span className="text-[11px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                已完成 ({completed})
              </span>
            </div>
            <div className="bg-white/60 dark:bg-[#191919]/60 rounded-xl border border-gray-100 dark:border-[#222222] divide-y divide-gray-50 dark:divide-[#222222]">
              {completedTasks.map(task => (
                <div 
                  key={task.id}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <button 
                    onClick={() => handleToggleTask(task.chatId, task.id)}
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${activeTab === 'bot' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' : 'bg-gray-100 dark:bg-[#2a2a2a] text-[#07c160]'}`}
                  >
                    <CheckCircle2 size={10} />
                  </button>
                  <p className="text-sm text-gray-400 dark:text-gray-500 line-through truncate flex-1">{task.text}</p>
                  <span className="text-[10px] text-gray-300 dark:text-gray-600 shrink-0">{task.chatName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
