'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-tajawal">
            تحقق من بريدك الإلكتروني
          </h2>
          <p className="text-sm text-muted-foreground mt-4 font-tajawal">
            لقد أرسلنا رابط تأكيد إلى بريدك الإلكتروني.
            <br />
            يرجى النقر على الرابط للتحقق من حسابك.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/auth/signin">
            <Button variant="outline" className="w-full font-tajawal">
              العودة إلى تسجيل الدخول
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground font-tajawal">
          لم تستلم البريد الإلكتروني؟ تحقق من مجلد البريد غير المرغوب فيه
        </p>
      </div>
    </div>
  );
}
