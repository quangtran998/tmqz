'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  // const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Tạm thời ẩn login, chuyển thẳng đến lucky-wheel
    router.push('/lucky-wheel');

    // TODO: Bật lại khi cần login
    // if (!loading) {
    //   if (user) {
    //     router.push('/chat');
    //   } else {
    //     router.push('/login');
    //   }
    // }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  );
}
