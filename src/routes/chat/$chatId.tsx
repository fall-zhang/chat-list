import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/chat-input/chat-input';
import PinnedMessagesBar from '@/components/PinnedMessagesBar';
import { useChat } from '@/hooks/useChat';
import { Assistant } from '@/types';
import { AnimatePresence } from 'motion/react';

export const Route = createFileRoute('/chat/$chatId')({
  component: ChatDetail,
});

function ChatDetail() {
  const { chatId } = useParams({ from: '/chat/$chatId' });
  const { 
    chat, 
    handleSend: sendChatMessage, 
    handleSetDeadline, 
    handleToggleComplete, 
    handleTogglePin 
  } = useChat(chatId);
  
  const [inputValue, setInputValue] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !chat) return;
    sendChatMessage(inputValue, selectedAssistant);
    setInputValue('');
    setSelectedAssistant(null);
  };

  if (!chat) return <div className="p-4 text-center text-gray-400">未找到聊天</div>;

  const userMessages = chat.messages.filter(m => m.sender === 'user');
  const totalTasks = userMessages.length;
  const completedTasks = userMessages.filter(m => m.isCompleted).length;
  const pinnedMessages = chat.messages.filter(m => m.isPinned);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] dark:bg-[#111111] font-sans text-[#191919] dark:text-gray-200 relative transition-colors duration-300">
      <ChatHeader 
        name={chat.name} 
        showBack={true} 
        totalTasks={totalTasks}
        completedTasks={completedTasks}
      />

      <PinnedMessagesBar 
        pinnedMessages={pinnedMessages}
        isPinnedExpanded={isPinnedExpanded}
        setIsPinnedExpanded={setIsPinnedExpanded}
        onTogglePin={handleTogglePin}
      />

      {/* Chat History */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth chat-history"
      >
        <AnimatePresence initial={false}>
          {chat.messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              msg={msg} 
              onToggleComplete={handleToggleComplete} 
              onTogglePin={handleTogglePin}
              onSetDeadline={handleSetDeadline}
            />
          ))}
        </AnimatePresence>
      </main>

      <ChatInput 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        onSend={handleSend} 
        assistants={chat.assistants}
        onSelectAssistant={setSelectedAssistant}
      />
    </div>
  );
}
