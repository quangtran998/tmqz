'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { messageApi } from '@/lib/api';
import ChatBox from '@/components/ChatBox';
import MessageInput from '@/components/MessageInput';
import UserList from '@/components/UserList';

export default function ChatPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const {
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendTyping,
    setInitialMessages,
  } = useSocket(token);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token) {
      messageApi.getMessages().then(({ data }) => {
        if (data) {
          setInitialMessages(data);
        }
      });
    }
  }, [token, setInitialMessages]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Chat App</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, <strong>{user.username}</strong>
            </span>
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <Link
              href="/lucky-wheel"
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              🧧 Lì Xì
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md">
            <ChatBox
              messages={messages}
              currentUserId={user._id}
              typingUsers={typingUsers}
            />
            <MessageInput
              onSend={sendMessage}
              onTyping={sendTyping}
              disabled={!isConnected}
            />
          </div>
          <div className="w-64">
            <UserList users={onlineUsers} currentUserId={user._id} />
          </div>
        </div>
      </main>
    </div>
  );
}
