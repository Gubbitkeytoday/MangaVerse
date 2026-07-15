'use client'

import { BookOpen, Github, Heart, Mail } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function Footer() {
  const goBrowse = useAppStore((s) => s.goBrowse)
  const goHome = useAppStore((s) => s.goHome)
  const goLibrary = useAppStore((s) => s.goLibrary)
  const goAdmin = useAppStore((s) => s.goAdmin)

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-rose-600 shadow-lg shadow-primary/30">
                <BookOpen className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black">
                Manga<span className="text-primary">Verse</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              แพลตฟอร์มอ่านมังงะแปลไทยออนไลน์ที่รวบรวมมังงะ มังฮวา และมังฮัว ครบทุกแนว
              อัปเดตรวดเร็ว พร้อมระบบหลังบ้านครบครัน เพื่อประสบการณ์การอ่านที่ดีที่สุด
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Email">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Github">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              สำรวจ
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={goHome} className="text-muted-foreground transition-colors hover:text-primary">
                  หน้าแรก
                </button>
              </li>
              <li>
                <button onClick={goBrowse} className="text-muted-foreground transition-colors hover:text-primary">
                  คลังมังงะทั้งหมด
                </button>
              </li>
              <li>
                <button onClick={goLibrary} className="text-muted-foreground transition-colors hover:text-primary">
                  คลังของฉัน
                </button>
              </li>
              <li>
                <button onClick={goAdmin} className="text-muted-foreground transition-colors hover:text-primary">
                  หลังบ้าน
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              หมวดหมู่ยอดนิยม
            </h4>
            <ul className="space-y-2 text-sm">
              {['แอ็กชัน', 'แฟนตาซี', 'โรแมนต์', 'สยองขวัญ', 'ตลก'].map((g) => (
                <li key={g}>
                  <button
                    onClick={() => goBrowse()}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MangaVerse — สร้างด้วยใจโดยทีมงานมืออาชีพ</p>
          <p className="flex items-center gap-1">
            ทำด้วย <Heart className="h-3 w-3 fill-primary text-primary" /> สำหรับผู้รักมังงะ
          </p>
        </div>
      </div>
    </footer>
  )
}
