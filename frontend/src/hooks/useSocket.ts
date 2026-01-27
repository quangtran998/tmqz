'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/lib/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface OnlineUser {
  id: string;
  username: string;
}

interface TypingUser {
  userId: string;
  username: string;
}

export function useSocket(token: string | null, room: string = 'general') {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join', room);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('user-list', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('typing', (user: TypingUser) => {
      setTypingUsers((prev) => {
        if (prev.find((u) => u.userId === user.userId)) return prev;
        return [...prev, user];
      });
    });

    newSocket.on('stop-typing', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, room]);

  const sendMessage = useCallback(
    (content: string) => {
      if (socket && content.trim()) {
        socket.emit('message', { content, room });
      }
    },
    [socket, room]
  );

  const sendTyping = useCallback(() => {
    if (socket) {
      socket.emit('typing', room);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', room);
      }, 2000);
    }
  }, [socket, room]);

  const setInitialMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
  }, []);

  return {
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendTyping,
    setInitialMessages,
  };
}
