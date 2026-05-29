import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { postsApi } from '../../services/api'
import { Separator } from '@/components/ui/separator'

function Create() {
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [image, setImage] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (!title || !content) {
			setErrorMessage('Judul dan konten wajib diisi.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')
			setSuccessMessage('')

			const createdPost = await postsApi.create({ title, content, image })
			setSuccessMessage('Post berhasil dibuat. Mengarahkan ke detail post...')

			setTimeout(() => {
				navigate(`/posts/${createdPost.id}`)
			}, 700)
		} catch (error) {
			setErrorMessage(error.message || 'Gagal membuat post.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="mx-auto w-full max-w-6xl">
			<Card>
				<CardHeader>
					<CardTitle>Create Post</CardTitle>
					<CardDescription>Tulis berita baru untuk dipublikasikan.</CardDescription>
				</CardHeader>

				<CardContent>
					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="title">Judul</Label>
							<Input
								id="title"
								type="text"
								placeholder="Masukkan judul berita"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Konten</Label>
							<Textarea
								id="content"
								placeholder="Tulis isi berita di sini..."
								className="min-h-52"
								value={content}
								onChange={(event) => setContent(event.target.value)}
							/>
						</div>
						{/*image pake file*/}
						<div className="space-y-2">
							<Label htmlFor="image">Gambar</Label>
							<Input
								id="image"
								type="file"
								accept="image/*"
								onChange={(event) => setImage(event.target.files[0])}
							/>
						</div>
						{/*menampilkan gambar saat ini jika ada*/}
						{image && (
							<img
								src={URL.createObjectURL(image)}
								alt="Preview"
								className="w-full h-64 object-cover rounded-lg"
							/>
						)}
						<Separator className="my-4" />
						{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
						{successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Menyimpan...' : 'Simpan Post'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Create
