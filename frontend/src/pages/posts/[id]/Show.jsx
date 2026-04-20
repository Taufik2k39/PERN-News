import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { postsApi } from '../../../services/api'
import { Separator } from '@/components/ui/separator'

function Show() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [post, setPost] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isDeleting, setIsDeleting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setIsLoading(true)
				setErrorMessage('')

				const selectedPost = await postsApi.getById(id)
				setPost(selectedPost)
			} catch (error) {
				setErrorMessage(error.message || 'Post tidak ditemukan.')
				setPost(null)
			} finally {
				setIsLoading(false)
			}
		}

		fetchPost()
	}, [id])

	const handleDelete = async () => {
		const shouldDelete = window.confirm('Yakin ingin menghapus post ini?')

		if (!shouldDelete) {
			return
		}

		try {
			setIsDeleting(true)
			setErrorMessage('')
			await postsApi.remove(id)
			navigate('/')
		} catch (error) {
			setErrorMessage(error.message || 'Gagal menghapus post.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className="mx-auto w-full max-w-6xl">
			<Card>
				<CardHeader>
					<CardTitle>Detail Post</CardTitle>
					<CardDescription>Lihat detail.</CardDescription>
				</CardHeader>

				<CardContent className="space-y-5">
					{isLoading ? <p className="text-sm text-muted-foreground">Memuat detail post...</p> : null}

					{!isLoading && errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

					{!isLoading && !errorMessage && post ? (
							<>
								<div className="space-y-3">
									<div className="flex flex-wrap items-center gap-3">
										<h2 className="text-2xl font-semibold">{post.title}</h2>
										<Badge variant="secondary">Penulis: {post.author_name || 'Anonim'}</Badge>
									</div>
									<div className="space-y-2">
										<Separator />
										<span className="block text-xs text-muted-foreground">ID: {post.id}</span>
									</div>
								</div>

								<p className="whitespace-pre-line text-sm leading-6 text-stone-700 dark:text-white">{post.content}</p>

							<div className="flex gap-3">
								<Button asChild>
									<Link to={`/posts/${id}/edit`}>Edit Post</Link>
								</Button>
								<Button asChild variant="outline">
									<Link to="/">Kembali</Link>
								</Button>
								<Button type="button" variant="outline" onClick={handleDelete} disabled={isDeleting}>
									{isDeleting ? 'Menghapus...' : 'Delete'}
								</Button>
							</div>
						</>
					) : null}
				</CardContent>
			</Card>
		</div>
	)
}

export default Show
