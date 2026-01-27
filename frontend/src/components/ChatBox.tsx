'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/api';

interface TypingUser {
  userId: string;
  username: string;
}

interface ChatBoxProps {
  messages: Message[];
  currentUserId: string;
  typingUsers: TypingUser[];
}

export default function ChatBox({ messages, currentUserId, typingUsers }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTypingUsers = typingUsers.filter((u) => u.userId !== currentUserId);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.sender === currentUserId;

          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {!isOwnMessage && (
                  <div className="text-xs font-semibold mb-1 text-blue-600">
                    {message.senderName}
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })
      )}

      {filteredTypingUsers.length > 0 && (
        <div className="text-gray-500 text-sm italic">
          {filteredTypingUsers.map((u) => u.username).join(', ')}{' '}
          {filteredTypingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
