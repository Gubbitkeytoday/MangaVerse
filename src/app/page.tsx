'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HomeView } from '@/components/views/home-view'
import { BrowseView } from '@/components/views/browse-view'
import { DetailView } from '@/components/views/detail-view'
import { ReaderView } from '@/components/views/reader-view'
import { LibraryView } from '@/components/views/library-view'
import { AdminView } from '@/components/views/admin-view'

export default function Home() {
  const view = useAppStore((s) => s.view)
  const selectedMangaSlug = useAppStore((s) => s.selectedMangaSlug)
  const selectedChapterId = useAppStore((s) => s.selectedChapterId)

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [view, selectedMangaSlug, selectedChapterId])

  const isReader = view === 'reader'

  return (
    <div className="flex min-h-screen flex-col">
      {!isReader && <Header />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (selectedMangaSlug ?? '') + (selectedChapterId ?? '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'home' && <HomeView />}
            {view === 'browse' && <BrowseView />}
            {view === 'detail' && selectedMangaSlug && <DetailView slug={selectedMangaSlug} />}
            {view === 'reader' && selectedMangaSlug && selectedChapterId && (
              <ReaderView slug={selectedMangaSlug} chapterId={selectedChapterId} />
            )}
            {view === 'library' && <LibraryView />}
            {view === 'admin' && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isReader && <Footer />}
    </div>
  )
}
