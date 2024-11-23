'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validateUsername = (username: string) => {
    const regex = /^[a-z0-9_]+$/;
    return regex.test(username);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('يرجى إدخال الاسم الأول');
      return;
    }

    if (!username.trim()) {
      setError('يرجى إدخال اسم المستخدم');
      return;
    }

    if (!validateUsername(username)) {
      setError('اسم المستخدم يجب أن يحتوي على أحرف صغيرة وأرقام وشرطة سفلية فقط');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }

    try {
      setLoading(true);

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        setError('اسم المستخدم مستخدم بالفعل');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      if (data) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user?.id,
            username,
            display_name: firstName,
            email,
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      router.push('/auth/verify-email');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight font-tajawal">
            إنشاء حساب جديد
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-tajawal">
            قم بإنشاء حساب للبدء في إنشاء صفحة روابطك
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="font-tajawal">الاسم الأول</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 text-right font-tajawal"
                placeholder="محمد"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="username" className="font-tajawal">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                className="mt-1 font-tajawal"
                placeholder="username"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground mt-1 font-tajawal">
                يمكن استخدام الأحرف الصغيرة والأرقام والشرطة السفلية فقط
              </p>
            </div>

            <div>
              <Label htmlFor="email" className="font-tajawal">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 font-tajawal"
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-tajawal">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 font-tajawal"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password" className="font-tajawal">تأكيد كلمة المرور</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 font-tajawal"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center font-tajawal">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full font-tajawal"
            disabled={loading}
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </Button>

          <p className="text-center text-sm text-muted-foreground font-tajawal">
            لديك حساب بالفعل؟{' '}
            <Link
              href="/auth/signin"
              className="text-primary hover:underline font-tajawal"
            >
              تسجيل الدخول
            </Link>
          </p>
        </form>

        <p className="text-xs text-center text-muted-foreground font-tajawal">
          بالنقر على إنشاء حساب، فإنك توافق على{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            شروط الخدمة
          </Link>{' '}
          و{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            سياسة الخصوصية
          </Link>
        </p>
      </div>
    </div>
  );
}
