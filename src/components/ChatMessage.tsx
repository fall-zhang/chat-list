import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, CheckCircle2, Circle, Clock, ListChecks, Check, Pin, PinOff, Calendar, Trash2 } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  msg: Message;
  onToggleComplete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onSetDeadline?: (id: string, date: Date) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, onToggleComplete, onTogglePin, onSetDeadline }) => {
  const isUser = msg.sender === 'user';
  const isAssistant = msg.sender === 'assistant';
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const dateStr = new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(msg.timestamp));
  const timeStr = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.timestamp));
  const deadlineStr = msg.deadline ? new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(msg.deadline)) : null;
  const completedAtStr = msg.completedAt ? new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.completedAt)) : null;

  useEffect(() => {
    if (msg.type === 'timer' && msg.timerEnd) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((msg.timerEnd! - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [msg.type, msg.timerEnd]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUser && onToggleComplete) {
      if (!msg.isCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }
      onToggleComplete(msg.id);
    }
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 600);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin?.(msg.id);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 group relative`}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center text-white z-10 ${
        isUser ? 'bg-[#07c160]' : isAssistant ? 'bg-orange-500' : 'bg-[#ffffff] dark:bg-[#2a2a2a] border border-[#e0e0e0] dark:border-[#333333]'
      }`}>
        {isUser ? <User size={20} /> : isAssistant ? <div className="text-xl">🤖</div> : <div className="text-[#07c160] font-bold">W</div>}
      </div>

      {/* Bubble Container */}
      <div 
        ref={menuRef}
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%] relative`}
      >
        {/* Top Popup for Times */}
        <AnimatePresence>
          {isExpanded && isUser && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -8, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-2 z-30"
            >
              <div className="bg-black/80 dark:bg-black/90 backdrop-blur-md text-white rounded-xl px-4 py-2 shadow-xl flex flex-col gap-1 min-w-[140px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-gray-400">发送时间</span>
                  <span className="text-[11px] font-mono">{timeStr}</span>
                </div>
                {deadlineStr && (
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-1">
                    <span className="text-[10px] text-orange-400">截止时间</span>
                    <span className="text-[11px] font-mono text-orange-300">{deadlineStr}</span>
                  </div>
                )}
                {completedAtStr && (
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-1">
                    <span className="text-[10px] text-[#07c160]">完成时间</span>
                    <span className="text-[11px] font-mono text-[#07c160]">{completedAtStr}</span>
                  </div>
                )}
              </div>
              {/* Arrow */}
              <div className="absolute top-full right-6 w-2 h-2 bg-black/80 dark:bg-black/90 rotate-45 -translate-y-1" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pop-out Menu for User Messages (Now integrated with the side expansion) */}
        <AnimatePresence>
          {isExpanded && isUser && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: -10 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-full top-0 h-full flex items-center gap-2 pr-2 z-20"
            >
              <div className="flex flex-col gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin?.(msg.id);
                    setIsExpanded(false);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${msg.isPinned ? 'bg-blue-500 text-white' : 'bg-white dark:bg-[#2a2a2a] text-gray-400 hover:text-blue-500'}`}
                >
                  <Pin size={14} className={msg.isPinned ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mock deadline setting for now
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    onSetDeadline?.(msg.id, tomorrow);
                    setIsExpanded(false);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${msg.deadline ? 'bg-orange-500 text-white' : 'bg-white dark:bg-[#2a2a2a] text-gray-400 hover:text-orange-500'}`}
                >
                  <Calendar size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          onClick={() => isUser && setIsExpanded(!isExpanded)}
          className={`relative px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all duration-500 cursor-pointer overflow-hidden ${
            isUser 
              ? msg.isCompleted 
                ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-400 dark:text-gray-500' 
                : 'bg-[#95ec69] dark:bg-[#2ba245] text-black dark:text-white hover:brightness-105 active:scale-[0.98]' 
              : isAssistant
                ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 text-black dark:text-white'
                : 'bg-white dark:bg-[#2a2a2a] text-black dark:text-white'
          } ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, x: 0, opacity: 1, scale: 1 }}
                  animate={{ 
                    y: -40, 
                    x: (i - 2.5) * 15, 
                    opacity: 0,
                    scale: 0.5,
                    rotate: i * 60
                  }}
                  className="absolute left-1/2 bottom-0 w-1.5 h-1.5 rounded-full bg-[#07c160]"
                />
              ))}
            </div>
          )}

          <div className={`relative z-10 ${msg.isCompleted ? 'line-through decoration-gray-400 dark:decoration-gray-600 decoration-2' : ''}`}>
            {msg.type === 'timer' ? (
              <div className="flex flex-col items-center gap-2 p-2 min-w-[120px]">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                  <Clock size={16} />
                  <span>倒计时</span>
                </div>
                <div className="text-3xl font-mono font-bold tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">{msg.text}</div>
              </div>
            ) : msg.type === 'summary' ? (
              <div className="flex flex-col gap-2 p-1">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold border-b border-blue-100 dark:border-blue-900/30 pb-1">
                  <ListChecks size={16} />
                  <span>今日工作总结</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ) : (
              msg.text
            )}
          </div>
          
          {/* Bubble Tail */}
          <div className={`absolute top-2 w-2 h-2 rotate-45 transition-colors duration-500 ${
            isUser 
              ? msg.isCompleted ? 'right-[-4px] bg-gray-100 dark:bg-[#2a2a2a]' : 'right-[-4px] bg-[#95ec69] dark:bg-[#2ba245]' 
              : isAssistant
                ? 'left-[-4px] bg-orange-50 dark:bg-orange-900/20 border-l border-b border-orange-100 dark:border-orange-900/30'
                : 'left-[-4px] bg-white dark:bg-[#2a2a2a]'
          }`} />

          {/* Pin Icon */}
          {msg.isPinned && (
            <div className={`absolute top-1 ${isUser ? 'left-1' : 'right-1'} text-gray-400 dark:text-gray-500`}>
              <Pin size={10} className="fill-current rotate-45" />
            </div>
          )}
        </div>
        
        {/* Status Label */}
        {isUser && (
          <motion.div 
            initial={false}
            animate={{ opacity: msg.isCompleted ? 1 : 0.4 }}
            className={`mt-1 flex items-center gap-1 text-[10px] font-medium transition-colors ${
              msg.isCompleted ? 'text-[#07c160] dark:text-[#07c160]' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {msg.isCompleted ? '任务已达成' : '待处理'}
          </motion.div>
        )}
      </div>

      {/* Checkbox for User Messages - Now on the left of bubble */}
      {isUser && (
        <motion.button
          layout
          onClick={handleToggle}
          animate={{ x: isExpanded ? -40 : 0 }}
          className={`mt-2 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            msg.isCompleted 
              ? 'bg-[#07c160] border-[#07c160] scale-110 shadow-lg' 
              : 'border-gray-300 dark:border-gray-700 hover:border-[#07c160] hover:scale-110'
          }`}
        >
          <AnimatePresence mode="wait">
            {msg.isCompleted ? (
              <motion.div
                key="checked"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
              >
                <Check size={14} className="text-white stroke-[3px]" />
              </motion.div>
            ) : (
              <motion.div key="unchecked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="w-1 h-1 bg-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Long Press Menu (Legacy, now replaced by click menu but kept for compatibility) */}
      <AnimatePresence>
        {false && (
          <>
            <div 
              className="fixed inset-0 z-40" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute z-50 bottom-full mb-2 ${isUser ? 'right-0' : 'left-0'} bg-white rounded-xl shadow-2xl border border-gray-100 p-1 min-w-[120px]`}
            >
              <button
                onClick={handlePin}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
              >
                {msg.isPinned ? (
                  <>
                    <PinOff size={16} className="text-red-500" />
                    <span>取消置顶</span>
                  </>
                ) : (
                  <>
                    <Pin size={16} className="text-blue-500" />
                    <span>置顶消息</span>
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatMessage;
