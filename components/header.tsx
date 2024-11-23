'use client'

import { LinkIcon } from 'lucide-react'
import { translations } from "@/app/i18n/translations"
import { useEffect, useState } from "react"

export function Header() {
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'ar'
    if (savedLang) {
      setLang(savedLang)
    }

    // Listen for language changes
    const handleLanguageChange = (event: any) => {
      setLang(event.detail.language)
    }
    window.addEventListener('languageChange', handleLanguageChange)
    return () => window.removeEventListener('languageChange', handleLanguageChange)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6" />
            <span className="font-bold font-tajawal">{translations[lang].multiLinks}</span>
          </div>
        </div>
      </div>
    </header>
  )
}