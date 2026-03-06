'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName) {
          toast.error('Please enter your full name');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName);
        toast.success('Account created! Welcome to BearFitPH');
      } else {
        await signIn(email, password);
        toast.success('Signed in successfully');
      }
      
      // Close modal after successful auth
      onOpenChange(false);
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
      setIsSignUp(false);
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/member/dashboard';
      }, 1000);
    } catch (error: any) {
      console.error('[v0] Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-[#222222]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            {isSignUp ? 'Join BearFitPH and start your fitness journey' : 'Sign in to your BearFitPH account'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300 text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                disabled={loading}
                className="bg-[#1a1a1a] border border-[#333333] text-white placeholder:text-gray-500 focus:border-[#F37120] focus:ring-[#F37120] rounded-lg"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-[#1a1a1a] border border-[#333333] text-white placeholder:text-gray-500 focus:border-[#F37120] focus:ring-[#F37120] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-[#1a1a1a] border border-[#333333] text-white placeholder:text-gray-500 focus:border-[#F37120] focus:ring-[#F37120] rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F37120] hover:bg-[#e06a10] text-white font-semibold py-2.5 rounded-lg mt-2 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400 mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmail('');
              setPassword('');
              setFullName('');
            }}
            className="text-[#F37120] hover:text-[#e06a10] font-semibold transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
