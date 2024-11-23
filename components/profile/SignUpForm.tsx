'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const validateUsername = (username: string) => {
    const regex = /^[a-z0-9_]+$/;
    return regex.test(username);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!firstName.trim()) {
        throw new Error('Please enter your first name');
      }

      if (!username.trim()) {
        throw new Error('Please enter a username');
      }

      if (!validateUsername(username)) {
        throw new Error('Username can only contain lowercase letters, numbers, and underscores');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if username exists
      const { data: exists, error: checkError } = await supabase
        .rpc('username_exists', { username: username.toLowerCase() });

      if (checkError) {
        console.error('Error checking username:', checkError);
        throw new Error('Error checking username availability');
      }

      if (exists) {
        throw new Error('Username is already taken');
      }

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: firstName.trim()
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('This email is already registered');
        }
        throw signUpError;
      }

      if (!authData?.user?.id) {
        throw new Error('Error creating account');
      }

      // Create the profile using the server-side API route
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: authData.user }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Profile creation error:', error);
        throw new Error('Error creating profile');
      }

      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1"
            placeholder="John"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            className="mt-1"
            placeholder="username"
            pattern="[a-z0-9_]+"
            title="Can only contain lowercase letters, numbers, and underscores"
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Can only contain lowercase letters, numbers, and underscores
          </p>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
            placeholder="email@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
