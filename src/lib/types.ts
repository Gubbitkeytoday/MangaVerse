// Shared types for MangaVerse

export type MangaStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS' | 'CANCELLED'
export type MangaType = 'MANGA' | 'MANHWA' | 'MANHUA' | 'WEBTOON'

export interface Manga {
  id: string
  title: string
  slug: string
  altTitles: string[]
  description: string
  cover: string
  banner: string
  author: string
  artist: string
  status: MangaStatus
  type: MangaType
  year: number | null
  rating: number
  ratingCount: number
  views: number
  followers: number
  featured: boolean
  createdAt: string
  updatedAt: string
  genres: Genre[]
  _count?: { chapters: number; comments: number; favorites: number; reviews: number }
  latestChapter?: Chapter
}

export interface Genre {
  id: string
  name: string
  slug: string
  _count?: { mangas: number }
}

export interface Chapter {
  id: string
  mangaId: string
  number: number
  title: string
  pages: string[]
  views: number
  publishedAt: string
  createdAt: string
}

export interface Comment {
  id: string
  mangaId: string
  chapterId: string | null
  author: string
  avatar: string | null
  content: string
  likes: number
  createdAt: string
}

export interface Review {
  id: string
  mangaId: string
  author: string
  rating: number
  content: string
  createdAt: string
}

export interface FavoriteItem {
  id: string
  mangaId: string
  manga: Manga
  createdAt: string
}

export interface HistoryItem {
  id: string
  mangaId: string
  chapterId: string
  manga: Manga
  chapter: Chapter
  progress: number
  updatedAt: string
  createdAt: string
}

export type ViewName =
  | 'home'
  | 'browse'
  | 'detail'
  | 'reader'
  | 'library'
  | 'admin'
