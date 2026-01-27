'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LuckyWheel from '@/components/LuckyWheel';

export default function LuckyWheelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-600 to-red-800">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-700 to-red-900 relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lanterns */}
        <div className="absolute top-4 left-10 text-6xl animate-swing">🏮</div>
        <div className="absolute top-4 right-10 text-6xl animate-swing" style={{ animationDelay: '0.5s' }}>🏮</div>
        <div className="absolute top-4 left-1/4 text-5xl animate-swing" style={{ animationDelay: '0.3s' }}>🏮</div>
        <div className="absolute top-4 right-1/4 text-5xl animate-swing" style={{ animationDelay: '0.7s' }}>🏮</div>

        {/* Fireworks */}
        <div className="absolute top-20 left-20 text-4xl animate-pulse">✨</div>
        <div className="absolute top-32 right-20 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>🎆</div>
        <div className="absolute bottom-20 left-10 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>🎇</div>
        <div className="absolute bottom-32 right-10 text-4xl animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/chat"
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Quay lại Chat
          </Link>
          <span className="text-white font-medium">
            Xin chào, <strong>{user.username}</strong>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 text-center mb-2 drop-shadow-lg">
          🧧 Vòng Quay May Mắn 🧧
        </h1>
        <p className="text-white/80 text-center mb-8 text-lg">
          Quay để nhận lì xì đầu năm!
        </p>

        <LuckyWheel />

        <div className="mt-8 text-center text-white/70 text-sm max-w-md">
          <p>🎊 Chúc Mừng Năm Mới 🎊</p>
          <p className="mt-1">Chúc bạn và gia đình một năm mới An Khang Thịnh Vượng, Vạn Sự Như Ý!</p>
        </div>
      </main>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-swing {
          animation: swing 2s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
}
