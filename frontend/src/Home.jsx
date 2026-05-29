import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { postsApi } from './services/api'
import { Separator } from '@radix-ui/react-separator'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchParams] = useSearchParams()
  const searchTerm = (searchParams.get('search') || '').trim().toLowerCase()

  const formatPostDateTime = (dateValue) => {
    if (!dateValue) return 'Tanggal tidak tersedia'

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return 'Tanggal tidak tersedia'
    }

    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAuthorName = (post) => {
    return (
      post.author_name ||
      post.authorName ||
      post.username ||
      post.user?.username ||
      'Penulis tidak diketahui'
    )
  }

  const getPostExcerpt = (post) => {
    if (post.excerpt) {
      return post.excerpt
    }

    if (!post.content) {
      return 'Belum ada ringkasan untuk post ini.'
    }

    return `${post.content.slice(0, 140)}${post.content.length > 140 ? '...' : ''}`
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const data = await postsApi.getAll()
        setPosts(Array.isArray(data) ? data : [])
      } catch (error) {
        setErrorMessage(error.message || 'Gagal memuat data post.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    if (!searchTerm) {
      return posts
    }

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.content,
        post.excerpt,
        getAuthorName(post),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(searchTerm)
    })
  }, [posts, searchTerm])

  return (
    <div className="space-y-5">
      <div className="space-y-2 px-2">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Home</h1>
        <p className="text-sm text-muted-foreground">
          {searchTerm
            ? `Menampilkan ${filteredPosts.length} hasil untuk "${searchParams.get('search')}".`
            : 'Jelajahi berita terbaru dari semua post.'}
        </p>
      </div>

      {isLoading && (
        <p className="px-2 text-sm text-muted-foreground">Memuat data post...</p>
      )}
      {!isLoading && errorMessage && (
        <p className="px-2 text-sm text-red-600">{errorMessage}</p>
      )}
      {!isLoading && !errorMessage && !searchTerm && posts.length === 0 && (
        <p className="px-2 text-sm text-muted-foreground">
          Belum ada post untuk ditampilkan.
        </p>
      )}
      {!isLoading && !errorMessage && searchTerm && filteredPosts.length === 0 && (
        <p className="px-2 text-sm text-muted-foreground">
          Tidak ada post yang cocok dengan pencarian Anda.
        </p>
      )}
      {/*menampilkan gambar di halaman ini */}
      {filteredPosts.map((post) => (
        <Card
          key={post.id}
          className="flex flex-row items-start rounded-xl bg-gray-100 shadow-sm dark:bg-stone-800/80"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-48 h-48 object-cover rounded-l-lg"
            />
          )}
          <div className="flex flex-col flex-1">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-xl font-semibold text-stone-900 dark:text-white">
                  {post.title}
                </CardTitle>
                <Badge variant="secondary" className="rounded-full bg-green-500 text-white">
                  {getAuthorName(post)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Diposting pada {formatPostDateTime(post.created_at || post.createdAt)}
              </p>
            </CardHeader>
            <Separator className="mx-6 my-3" />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getPostExcerpt(post)}
              </p>
            </CardContent>
            <CardFooter>
              <Link
                to={`/posts/${post.id}`}
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Lihat detail
              </Link>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Home
