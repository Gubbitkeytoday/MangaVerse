import { db } from '../src/lib/db'

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const GENRES = [
  'Action', 'Adventure', 'Fantasy', 'Romance', 'Sci-Fi', 'Horror',
  'Mystery', 'Comedy', 'Drama', 'Slice of Life', 'Supernatural',
  'Mecha', 'Historical', 'Psychological', 'School', 'Cyberpunk',
]

interface MangaSeed {
  title: string
  alt: string[]
  cover: string
  banner?: string
  author: string
  artist?: string
  status: string
  type: string
  year: number
  rating: number
  ratingCount: number
  views: number
  followers: number
  featured: boolean
  description: string
  genres: string[]
  chapterCount: number
}

const MANGAS: MangaSeed[] = [
  {
    title: 'Shadow Realm Chronicles',
    alt: ['Kage no Okoku', 'ซ่อนเงาภพ'],
    cover: '/covers/shadow-realm.png',
    banner: '/covers/shadow-realm.png',
    author: 'Kuroda Renji',
    artist: 'Kuroda Renji',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2022,
    rating: 4.8,
    ratingCount: 12453,
    views: 4820000,
    followers: 184000,
    featured: true,
    description:
      'In a world where shadows hold forgotten souls, a young swordsman named Kaito inherits the cursed Crimson Katana — a blade that can sever the boundary between the living and the dead. As he journeys through the haunted Shadow Realm, he must uncover the truth behind his clan\'s annihilation before the darkness consumes him entirely. Every swing of his blade writes a new chapter in a war that has raged for a thousand years.',
    genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    chapterCount: 48,
  },
  {
    title: 'Crimson Moon Academy',
    alt: ['Akatsuki no Gakuen', 'รัตติกาลสีชาด'],
    cover: '/covers/crimson-moon.png',
    banner: '/covers/crimson-moon.png',
    author: 'Hoshino Mei',
    artist: 'Hoshino Mei',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2021,
    rating: 4.7,
    ratingCount: 9821,
    views: 3610000,
    followers: 156000,
    featured: true,
    description:
      'Hidden beneath the streets of Kyoto lies an academy where vampires, werewolves, and exorcists study side by side — bound by an ancient truce. When transfer student Aya discovers she carries the bloodline of the Moon Queen, she becomes the target of every faction vying for power. Romance, betrayal, and moonlit battles intertwine in this gothic supernatural tale.',
    genres: ['Supernatural', 'Romance', 'School', 'Drama'],
    chapterCount: 62,
  },
  {
    title: 'Neon Samurai',
    alt: ['Neon Samurai 2099'],
    cover: '/covers/neon-samurai.png',
    banner: '/covers/neon-samurai.png',
    author: 'Takeshi Ito',
    artist: 'Takeshi Ito',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2023,
    rating: 4.6,
    ratingCount: 7634,
    views: 2940000,
    followers: 121000,
    featured: true,
    description:
      'Neo-Tokyo, 2099. Corporations rule with iron and code, and the last samurai wanders the rain-soaked streets wielding a katana forged from quantum steel. Raiden abandoned his name and his past, but when a rogue AI begins assassinating the city\'s elite, he must choose between his vow of solitude and the city that forgot him. A cyberpunk saga of honor in a world without it.',
    genres: ['Action', 'Cyberpunk', 'Sci-Fi', 'Drama'],
    chapterCount: 24,
  },
  {
    title: 'Whispers of the Void',
    alt: ['Kūkyo no Sasayaki'],
    cover: '/covers/whispers-void.png',
    author: 'Saito Yumi',
    artist: 'Saito Yumi',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2020,
    rating: 4.9,
    ratingCount: 15203,
    views: 5230000,
    followers: 203000,
    featured: true,
    description:
      'Dr. Emi Tanaka leads the first expedition beyond the edge of the observable universe — and finds something staring back. As her crew begins to hear whispers in the silence between stars, reality itself starts to unravel. A psychological cosmic horror that asks: what happens when you look into the void, and it looks back with your own eyes?',
    genres: ['Horror', 'Sci-Fi', 'Mystery', 'Psychological'],
    chapterCount: 31,
  },
  {
    title: 'Stellar Vanguard',
    alt: ['Hoshi no Senkan'],
    cover: '/covers/stellar-vanguard.png',
    author: 'Nakamura Ken',
    artist: 'Yamada Sora',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2022,
    rating: 4.5,
    ratingCount: 6102,
    views: 2280000,
    followers: 98000,
    featured: true,
    description:
      'The Galactic Federation has fallen. From its ashes rises Captain Mira Vance and the last warship of the Stellar Vanguard — a ragtag crew sworn to protect the frontier worlds from the encroaching Void Fleet. With every battle, Mira must weigh the lives of her crew against the survival of billions. Epic space opera with heart-pounding fleet battles.',
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Mecha'],
    chapterCount: 40,
  },
  {
    title: 'The Last Alchemist',
    alt: ['Saigo no Renkinjutsushi'],
    cover: '/covers/last-alchemist.png',
    author: 'Mori Akira',
    artist: 'Mori Akira',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2019,
    rating: 4.7,
    ratingCount: 11290,
    views: 4120000,
    followers: 167000,
    featured: false,
    description:
      'After the Great Collapse, magic faded from the world and the alchemists were hunted to extinction — all except one. Elric, the last alchemist, lives in a hidden tower, guarding the final recipes that could rebuild civilization or destroy it. When a young thief stumbles into his sanctuary seeking a cure for a dying sister, Elric must decide whether the world deserves a second chance.',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    chapterCount: 55,
  },
  {
    title: 'Echoes of Eternity',
    alt: ['Eien no Kodama'],
    cover: '/covers/echoes-eternity.png',
    author: 'Fujii Hana',
    artist: 'Fujii Hana',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2021,
    rating: 4.6,
    ratingCount: 8410,
    views: 3050000,
    followers: 132000,
    featured: false,
    description:
      'Two souls bound across a thousand lifetimes by a promise made under a falling star. In every era, they find each other — and in every era, they are torn apart. Now, in the modern world, university student Sora begins to dream of lives she never lived and a love she cannot forget. A sweeping romance that spans centuries, beautifully illustrated.',
    genres: ['Romance', 'Drama', 'Supernatural'],
    chapterCount: 38,
  },
  {
    title: 'Phantom Blade',
    alt: ['Maboroshi no Yaiba'],
    cover: '/covers/phantom-blade.png',
    author: 'Tanaka Jiro',
    artist: 'Tanaka Jiro',
    status: 'COMPLETED',
    type: 'MANHUA',
    year: 2018,
    rating: 4.8,
    ratingCount: 13567,
    views: 4680000,
    followers: 178000,
    featured: false,
    description:
      'Feudal Japan, 1603. The Tokugawa shogunate has unified the land, but in the shadows, the Phantom Clan wages a silent war. Kage, the clan\'s deadliest assassin, is betrayed by his master and left for dead. Resurrected by a mysterious fox spirit, he now hunts those who wronged him with blades that pass through solid steel. A historical epic of revenge and redemption.',
    genres: ['Action', 'Historical', 'Adventure'],
    chapterCount: 72,
  },
  {
    title: 'Mecha Heart',
    alt: ['Kikai no Kokoro'],
    cover: '/covers/mecha-heart.png',
    author: 'Suzuki Daichi',
    artist: 'Suzuki Daichi',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2023,
    rating: 4.4,
    ratingCount: 4821,
    views: 1920000,
    followers: 84000,
    featured: false,
    description:
      'In 2147, humanity pilots giant mechs powered by neural-linked hearts — but only those who have lost something precious can synchronize. Sixteen-year-old Ren, grieving her brother, becomes the youngest pilot in history. As she battles the mechanical Swarm threatening Earth\'s last city, she discovers that her brother\'s consciousness may still live inside her mech.',
    genres: ['Mecha', 'Sci-Fi', 'Action', 'Drama'],
    chapterCount: 18,
  },
  {
    title: 'Sakura Days',
    alt: ['Sakura no Hibi'],
    cover: '/covers/sakura-days.png',
    author: 'Watanabe Yui',
    artist: 'Watanabe Yui',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2022,
    rating: 4.5,
    ratingCount: 7103,
    views: 2580000,
    followers: 109000,
    featured: false,
    description:
      'A gentle slice-of-life story about Haru, a shy college freshman who joins the university gardening club and slowly blossoms alongside the cherry trees she tends. Through the seasons, she makes friends, falls in love, and learns that growth takes patience. Warm, funny, and bittersweet — a love letter to ordinary days.',
    genres: ['Slice of Life', 'Romance', 'Comedy', 'School'],
    chapterCount: 26,
  },
  {
    title: "Dragon's Heir",
    alt: ['Ryū no Keishōsha'],
    cover: '/covers/dragons-heir.png',
    author: 'Kimura Ryo',
    artist: 'Kimura Ryo',
    status: 'ONGOING',
    type: 'MANHWA',
    year: 2020,
    rating: 4.7,
    ratingCount: 10542,
    views: 3890000,
    followers: 149000,
    featured: false,
    description:
      'The dragons vanished a thousand years ago — but their blood lives on in Kael, a blacksmith\'s apprentice who discovers he can hear the last dragon\'s voice in his dreams. When the Empire begins hunting dragon-blooded children to fuel their war machine, Kael must awaken the dormant power within and lead a rebellion. A sweeping fantasy of fire and fate.',
    genres: ['Fantasy', 'Action', 'Adventure', 'Drama'],
    chapterCount: 44,
  },
  {
    title: 'Midnight Café',
    alt: ['Mayonaka no Kafe'],
    cover: '/covers/midnight-cafe.png',
    author: 'Aoki Sora',
    artist: 'Aoki Sora',
    status: 'ONGOING',
    type: 'MANGA',
    year: 2023,
    rating: 4.3,
    ratingCount: 3987,
    views: 1640000,
    followers: 71000,
    featured: false,
    description:
      'There\'s a café that only opens at midnight, and only those who are truly lost can find it. Each chapter follows a different customer who stumbles through its door, carrying a burden too heavy to bear alone. The mysterious barista serves not just coffee, but the exact words each soul needs to hear. Heartwarming, melancholic, and quietly magical.',
    genres: ['Slice of Life', 'Drama', 'Supernatural'],
    chapterCount: 15,
  },
]

const SAMPLE_COMMENTS = [
  { author: 'Yuki_92', content: 'This chapter gave me chills! The artwork is absolutely stunning 🔥' },
  { author: 'manga_addict', content: 'No way that plot twist at the end!! I need the next chapter NOW' },
  { author: 'silent_reader', content: 'The character development in this series is unmatched. Truly a masterpiece.' },
  { author: 'otaku_king', content: 'Been following this for 2 years and it never disappoints. Author is a genius.' },
  { author: 'neko_chan', content: 'I cried. I actually cried. Why must you hurt me like this 😭' },
  { author: 'blade_runner', content: 'The fight choreography is top tier. Every panel flows perfectly.' },
  { author: 'stardust', content: 'Underrated gem. More people need to read this!' },
]

const SAMPLE_REVIEWS = [
  { author: 'CritiqueAce', rating: 5, content: 'A genre-defining work. The pacing, art, and emotional resonance set a new standard. Every chapter rewards careful reading — foreshadowing pays off beautifully across arcs. This is the kind of story that reminds you why manga is an art form.' },
  { author: 'PageTurner', rating: 5, content: 'I have read hundreds of manga and few achieve this level of consistency. The world-building feels organic, the cast is memorable, and the thematic depth rewards re-reads. An instant classic.' },
  { author: 'InkLover', rating: 4, content: 'Stunning artwork and a compelling lead. The middle arc drags slightly, but the payoff is more than worth it. Highly recommended for fans of the genre.' },
]

async function main() {
  console.log('🌱 Seeding database...')

  await db.readingHistory.deleteMany()
  await db.favorite.deleteMany()
  await db.review.deleteMany()
  await db.comment.deleteMany()
  await db.chapter.deleteMany()
  await db.mangaGenre.deleteMany()
  await db.genre.deleteMany()
  await db.manga.deleteMany()

  const genreMap = new Map<string, string>()
  for (const g of GENRES) {
    const created = await db.genre.create({ data: { name: g, slug: slugify(g) } })
    genreMap.set(g, created.id)
  }
  console.log(`  ✓ Created ${GENRES.length} genres`)

  for (let i = 0; i < MANGAS.length; i++) {
    const m = MANGAS[i]
    const manga = await db.manga.create({
      data: {
        title: m.title,
        slug: slugify(m.title),
        altTitles: JSON.stringify(m.alt),
        description: m.description,
        cover: m.cover,
        banner: m.banner ?? m.cover,
        author: m.author,
        artist: m.artist ?? m.author,
        status: m.status,
        type: m.type,
        year: m.year,
        rating: m.rating,
        ratingCount: m.ratingCount,
        views: m.views,
        followers: m.followers,
        featured: m.featured,
      },
    })

    await db.mangaGenre.createMany({
      data: m.genres.map((g) => ({ mangaId: manga.id, genreId: genreMap.get(g)! })),
    })

    const chapters = []
    for (let c = 1; c <= m.chapterCount; c++) {
      const pageCount = 8 + ((c + i) % 6)
      const pages = JSON.stringify(
        Array.from({ length: pageCount }, (_, p) => `page:${manga.slug}:${c}:${p}`)
      )
      const ch = await db.chapter.create({
        data: {
          mangaId: manga.id,
          number: c,
          title: c % 7 === 0 ? `The Turning Point` : c % 5 === 0 ? `Echoes` : `Chapter ${c}`,
          pages,
          views: Math.floor(m.views / m.chapterCount / (c + 1)) + Math.floor(Math.random() * 5000),
          publishedAt: new Date(Date.now() - c * 3 * 24 * 60 * 60 * 1000),
        },
      })
      chapters.push(ch)
    }

    const commentCount = 4 + (i % 4)
    for (let k = 0; k < commentCount; k++) {
      const cm = SAMPLE_COMMENTS[(i + k) % SAMPLE_COMMENTS.length]
      await db.comment.create({
        data: {
          mangaId: manga.id,
          author: cm.author,
          content: cm.content,
          likes: Math.floor(Math.random() * 320) + 5,
          createdAt: new Date(Date.now() - k * 12 * 60 * 60 * 1000 - i * 60000),
        },
      })
    }

    for (let r = 0; r < Math.min(3, SAMPLE_REVIEWS.length); r++) {
      const rv = SAMPLE_REVIEWS[(i + r) % SAMPLE_REVIEWS.length]
      await db.review.create({
        data: {
          mangaId: manga.id,
          author: rv.author,
          rating: rv.rating,
          content: rv.content,
          createdAt: new Date(Date.now() - r * 5 * 24 * 60 * 60 * 1000 - i * 60000),
        },
      })
    }

    if (i % 2 === 0) {
      await db.favorite.create({
        data: { mangaId: manga.id, userId: 'guest', createdAt: new Date(Date.now() - i * 86400000) },
      })
    }
    if (i < 6) {
      const ch = chapters[Math.min(2, chapters.length - 1)]
      await db.readingHistory.create({
        data: {
          mangaId: manga.id,
          chapterId: ch.id,
          userId: 'guest',
          progress: 0.3 + (i % 5) * 0.15,
          updatedAt: new Date(Date.now() - i * 3600000 * 5),
        },
      })
    }

    console.log(`  ✓ ${m.title} — ${m.chapterCount} chapters`)
  }

  console.log('🌱 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
