import { Chat, Assistant } from './types';

export const defaultAssistants: Assistant[] = [
  {
    id: 'a1',
    name: '总结机器人',
    avatar: '📊',
    description: '每天总结当前完成项目',
    role: 'summary',
  },
  {
    id: 'a2',
    name: '系统机器人',
    avatar: '⚙️',
    description: '提供倒计时时钟等系统功能',
    role: 'system',
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    name: '微信助手',
    lastMessage: '你好！这是一个仿微信的聊天界面。',
    avatar: 'W',
    assistants: defaultAssistants,
    messages: [
      {
        id: 'm1',
        text: '你好！这是一个仿微信的聊天界面。',
        sender: 'bot',
        timestamp: new Date(),
        isCompleted: true,
      },
      {
        id: 'm1-1',
        text: '准备周会 PPT',
        sender: 'user',
        timestamp: new Date(),
        isCompleted: true,
      },
      {
        id: 'm1-2',
        text: '回复客户邮件',
        sender: 'user',
        timestamp: new Date(),
        isCompleted: false,
      },
      {
        id: 'm1-3',
        text: '生成上周工作周报',
        sender: 'bot',
        timestamp: new Date(),
        isCompleted: false,
      },
    ],
  },
  {
    id: '2',
    name: '文件传输助手',
    lastMessage: '[文件] 2026年工作计划.pdf',
    avatar: 'F',
    assistants: defaultAssistants,
    messages: [
      {
        id: 'm2',
        text: '已收到文件：2026年工作计划.pdf',
        sender: 'bot',
        timestamp: new Date(),
        isCompleted: true,
      },
      {
        id: 'm2-1',
        text: '整理 2026 年工作计划',
        sender: 'user',
        timestamp: new Date(),
        isCompleted: true,
      },
      {
        id: 'm2-2',
        text: '分析 PDF 内容并提取关键词',
        sender: 'bot',
        timestamp: new Date(),
        isCompleted: false,
      },
    ],
  },
  {
    id: '3',
    name: '订阅号消息',
    lastMessage: '今日头条：AI 时代的新机遇',
    avatar: 'S',
    assistants: defaultAssistants,
    messages: [
      {
        id: 'm3',
        text: '今日头条：AI 时代的新机遇',
        sender: 'bot',
        timestamp: new Date(),
      },
    ],
  },
];
