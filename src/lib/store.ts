import { create } from 'zustand'
import type { ViewName } from '@/lib/types'

interface AppState {
  // Navigation
  view: ViewName
  selectedMangaSlug: string | null
  selectedChapterId: string | null
  browseQuery: string
  browseGenre: string
  browseSort: string

  // Reader settings
  readerMode: 'vertical' | 'paged'
  readerFit: 'width' | 'height' | 'original'

  // UI
  searchOpen: boolean
  commandOpen: boolean

  // Actions
  goHome: () => void
  goBrowse: (opts?: { q?: string; genre?: string; sort?: string }) => void
  goDetail: (slug: string) => void
  goReader: (slug: string, chapterId: string) => void
  goLibrary: () => void
  goAdmin: () => void
  setReaderMode: (m: 'vertical' | 'paged') => void
  setReaderFit: (f: 'width' | 'height' | 'original') => void
  setSearchOpen: (v: boolean) => void
  setCommandOpen: (v: boolean) => void
  setBrowseQuery: (q: string) => void
  setBrowseGenre: (g: string) => void
  setBrowseSort: (s: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'home',
  selectedMangaSlug: null,
  selectedChapterId: null,
  browseQuery: '',
  browseGenre: '',
  browseSort: 'popular',
  readerMode: 'vertical',
  readerFit: 'width',
  searchOpen: false,
  commandOpen: false,

  goHome: () => set({ view: 'home', selectedMangaSlug: null, selectedChapterId: null }),
  goBrowse: (opts) =>
    set({
      view: 'browse',
      browseQuery: opts?.q ?? '',
      browseGenre: opts?.genre ?? '',
      browseSort: opts?.sort ?? 'popular',
      selectedMangaSlug: null,
      selectedChapterId: null,
    }),
  goDetail: (slug) =>
    set({ view: 'detail', selectedMangaSlug: slug, selectedChapterId: null }),
  goReader: (slug, chapterId) =>
    set({ view: 'reader', selectedMangaSlug: slug, selectedChapterId: chapterId }),
  goLibrary: () =>
    set({ view: 'library', selectedMangaSlug: null, selectedChapterId: null }),
  goAdmin: () =>
    set({ view: 'admin', selectedMangaSlug: null, selectedChapterId: null }),
  setReaderMode: (m) => set({ readerMode: m }),
  setReaderFit: (f) => set({ readerFit: f }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setCommandOpen: (v) => set({ commandOpen: v }),
  setBrowseQuery: (q) => set({ browseQuery: q }),
  setBrowseGenre: (g) => set({ browseGenre: g }),
  setBrowseSort: (s) => set({ browseSort: s }),
}))
