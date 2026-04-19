import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postsApi } from './services/api'
import { Separator } from '@radix-ui/react-separator'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const formatPostDate = (dateValue) => {
    if (!dateValue) return 'Tanggal tidak tersedia'

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return 'Tanggal tidak tersedia'
    }

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
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

  return (
    <div className="space-y-5">
      <h1 className="px-2 text-3xl font-bold text-stone-900 dark:text-white">Home</h1>

      {isLoading && (
        <p className="px-2 text-sm text-muted-foreground">Memuat data post...</p>
      )}
      {!isLoading && errorMessage && (
        <p className="px-2 text-sm text-red-600">{errorMessage}</p>
      )}
      {!isLoading && !errorMessage && posts.length === 0 && (
        <p className="px-2 text-sm text-muted-foreground">
          Belum ada post untuk ditampilkan.
        </p>
      )}

      {posts.map((post) => (
        <Card
          key={post.id}
          className="rounded-xl bg-gray-100 dark:bg-stone-800/80 shadow-sm"
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-stone-900 dark:text-white">
              {post.title}
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Diposting pada {formatPostDate(post.created_at || post.createdAt)}
            </p>
          </CardHeader>
          <Separator className="mx-6 my-3" />
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {post.excerpt}
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
        </Card>
      ))}
    </div>
  )
}

export default Home
