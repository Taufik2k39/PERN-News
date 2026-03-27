import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '../../services/api'

export default function EditProfile() {
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setIsLoading(true)
				setErrorMessage('')
				const profile = await authApi.me()
				setUsername(profile.username ?? '')
				setEmail(profile.email ?? '')
			} catch (error) {
				setErrorMessage(error.message || 'Gagal memuat data profil.')
			} finally {
				setIsLoading(false)
			}
		}

		fetchProfile()
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (!username || !email) {
			setErrorMessage('Username dan email wajib diisi.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')
			setSuccessMessage('')
			await authApi.updateMe({ username, email })
			setSuccessMessage('Profil berhasil diperbarui.')
		} catch (error) {
			setErrorMessage(error.message || 'Gagal memperbarui profil.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleBack = () => {
		navigate('/me')
	}

	return (
		<div className="mx-auto w-full max-w-6xl">
			<Card>
				<CardHeader>
					<CardTitle>Edit Profile</CardTitle>
					<CardDescription>Perbarui data akun Anda.</CardDescription>
				</CardHeader>

				<CardContent>
					{isLoading ? (
						<p className="text-sm text-muted-foreground">Memuat data profil...</p>
					) : (
						<form className="space-y-5" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									placeholder="Masukkan username"
									value={username}
									onChange={(event) => setUsername(event.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="nama@email.com"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
								/>
							</div>

							{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
							{successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

							<div className="flex gap-3">
								<Button type="button" variant="outline" onClick={handleBack}>
									Kembali
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
