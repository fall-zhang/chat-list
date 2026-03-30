import { useState, useEffect } from 'react';
import { mockChats } from '../mockData';
import { Chat, Message, Assistant } from '../types';

export const useChat = (chatId: string) => {
  const [chat, setChat] = useState<Chat | undefined>(() => mockChats.find(c => c.id === chatId));

  useEffect(() => {
    setChat(mockChats.find(c => c.id === chatId));
  }, [chatId]);

  const handleSend = (text: string, selectedAssistant: Assistant | null) => {
    if (!text.trim() || !chat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...chat.messages, newMessage];
    
    let assistantResponse: Message | null = null;
    
    if (selectedAssistant) {
      if (selectedAssistant.role === 'summary') {
        const completedTasks = updatedMessages
          .filter(m => m.sender === 'user' && m.isCompleted)
          .map(m => `• ${m.text}`)
          .join('\n');
        
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          text: completedTasks ? `你今天完成了以下项目：\n${completedTasks}` : '你今天还没有完成任何项目哦，加油！',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'summary',
          assistantId: selectedAssistant.id
        };
      } else if (selectedAssistant.role === 'system') {
        if (text.includes('定时') || text.includes('倒计时')) {
          let durationMs = 0;
          if (text.includes('半小时')) durationMs = 30 * 60 * 1000;
          else if (text.includes('一小时')) durationMs = 60 * 60 * 1000;
          else {
            const match = text.match(/(\d+)分钟/);
            if (match) durationMs = parseInt(match[1]) * 60 * 1000;
            else durationMs = 5 * 60 * 1000;
          }

          assistantResponse = {
            id: (Date.now() + 1).toString(),
            text: `好的，已为你开启倒计时。`,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'timer',
            timerEnd: Date.now() + durationMs,
            assistantId: selectedAssistant.id
          };
        }
      }
    }

    const finalMessages = assistantResponse ? [...updatedMessages, assistantResponse] : updatedMessages;

    const updatedChat = {
      ...chat,
      messages: finalMessages,
      lastMessage: assistantResponse ? assistantResponse.text : text,
    };
    
    setChat(updatedChat);
    updateMockData(updatedChat);
  };

  const handleSetDeadline = (messageId: string, deadline: Date) => {
    if (!chat) return;
    const updatedMessages = chat.messages.map(msg => 
      msg.id === messageId ? { ...msg, deadline } : msg
    );
    const updatedChat = { ...chat, messages: updatedMessages };
    setChat(updatedChat);
    updateMockData(updatedChat);
  };

  const handleToggleComplete = (messageId: string) => {
    if (!chat) return;
    const updatedMessages = chat.messages.map(msg => {
      if (msg.id === messageId) {
        const isCompleted = !msg.isCompleted;
        return { 
          ...msg, 
          isCompleted,
          completedAt: isCompleted ? new Date() : undefined
        };
      }
      return msg;
    });
    const updatedChat = { ...chat, messages: updatedMessages };
    setChat(updatedChat);
    updateMockData(updatedChat);
  };

  const handleTogglePin = (messageId: string) => {
    if (!chat) return;
    const updatedMessages = chat.messages.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    );
    const updatedChat = { ...chat, messages: updatedMessages };
    setChat(updatedChat);
    updateMockData(updatedChat);
  };

  const updateMockData = (updatedChat: Chat) => {
    const chatIndex = mockChats.findIndex(c => c.id === updatedChat.id);
    if (chatIndex !== -1) {
      mockChats[chatIndex] = updatedChat;
    }
  };

  return {
    chat,
    handleSend,
    handleSetDeadline,
    handleToggleComplete,
    handleTogglePin
  };
};
