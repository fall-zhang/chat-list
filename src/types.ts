export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'assistant';
  timestamp: Date;
  isCompleted?: boolean;
  completedAt?: Date;
  isPinned?: boolean;
  deadline?: Date;
  assistantId?: string;
  type?: 'text' | 'timer' | 'summary';
  timerEnd?: number; // timestamp
}

export interface Assistant {
  id: string;
  name: string;
  avatar: string;
  description: string;
  role: 'summary' | 'system' | 'general';
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  messages: Message[];
  assistants?: Assistant[];
}
