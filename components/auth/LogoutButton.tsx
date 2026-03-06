'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error: any) {
      console.error('[v0] Logout error:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F37120] hover:bg-[#e06a10] text-white text-sm font-semibold transition-colors disabled:opacity-50"
      title="Sign out"
    >
      <LogOut className="w-4 h-4" />
      {loading ? 'Signing out...' : 'Logout'}
    </button>
  );
}
