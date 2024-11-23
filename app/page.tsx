'use client';

import ParticlesBackground from "@/components/ParticlesBackground";
import TypewriterEffect from "@/components/TypewriterEffect";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      
      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,400px] lg:gap-12 xl:grid-cols-[1fr,450px]">
            {/* Left side: Hero content */}
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-tajawal">
                  مرحباً بك في متعدد الروابط
                </h1>
                <div className="h-16 text-xl font-light text-muted-foreground sm:text-2xl">
                  <TypewriterEffect 
                    strings={[
                      "شارك جميع روابطك في مكان واحد",
                      "أنشئ صفحتك الشخصية",
                      "خصص روابطك",
                      "شارك مع العالم"
                    ]} 
                  />
                </div>
              </div>
              <div className="mx-auto max-w-[700px] space-y-4 lg:mx-0">
                <p className="text-muted-foreground sm:text-xl font-tajawal">
                  أنشئ صفحتك الشخصية وشارك جميع روابطك مع جمهورك. بسيط، سريع، وجميل.
                </p>
              </div>
            </div>

            {/* Right side: Auth Buttons */}
            <div className="mx-auto w-full max-w-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Link href="/auth/signup" className="w-full">
                  <Button size="lg" className="w-full font-tajawal">
                    إنشاء حساب
                  </Button>
                </Link>
                <Link href="/auth/signin" className="w-full">
                  <Button variant="outline" size="lg" className="w-full font-tajawal">
                    تسجيل الدخول
                  </Button>
                </Link>
              </div>

              {/* Demo Button */}
              <div className="mt-4">
                <Link href="/demo">
                  <Button variant="ghost" size="lg" className="font-tajawal">
                    عرض توضيحي
                  </Button>
                </Link>
              </div>

              {/* Terms and Privacy */}
              <p className="px-8 text-center text-sm text-muted-foreground font-tajawal">
                من خلال النقر على إنشاء حساب، أنت توافق على{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  سياسة الخصوصية
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}