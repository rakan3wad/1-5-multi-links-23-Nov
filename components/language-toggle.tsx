'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LanguageToggle() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Set initial language from localStorage or browser preference
    const savedLang = localStorage.getItem('language') as 'en' | 'ar';
    if (savedLang) {
      setLang(savedLang);
      updateLanguage(savedLang);
    }
  }, []);

  const updateLanguage = (newLang: 'en' | 'ar') => {
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = newLang === 'ar' ? 'font-arabic rtl' : 'font-inter ltr';
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('language', newLang);
    updateLanguage(newLang);
    
    // Dispatch a custom event for other components
    const event = new CustomEvent('languageChange', { 
      detail: { language: newLang } 
    });
    window.dispatchEvent(event);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={`fixed top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} z-50 flex items-center gap-2`}>
      <Button 
        onClick={toggleLanguage}
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
      >
        {lang === 'en' ? 'عربي' : 'En'}
      </Button>
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 flex items-center space-x-2 text-gray-700 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
}
