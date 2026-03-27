import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from '../../services/api'

export default function Register() {
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (!username || !email || !password) {
			setErrorMessage('Nama, email, dan password wajib diisi.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')
			setSuccessMessage('')

			await authApi.register({ username, email, password })
			setSuccessMessage('Registrasi berhasil. Mengarahkan ke halaman login...')

			setTimeout(() => {
				navigate('/login')
			}, 700)
		} catch (error) {
			setErrorMessage(error.message || 'Registrasi gagal. Silakan coba lagi.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
	<div className='bg-linear-to-br from-emerald-300 via-teal-300 to-blue-300 dark:from-cyan-700 dark:via-sky-700 dark:to-blue-700 min-h-screen flex items-center justify-center'>
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Register</CardTitle>
					<CardDescription>Buat akun baru untuk mulai menggunakan aplikasi.</CardDescription>
				</CardHeader>

				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="name">Nama</Label>
							<Input
								id="name"
								type="text"
								placeholder="Masukkan nama lengkap"
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

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Buat password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>

						{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
						{successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? 'Memproses...' : 'Daftar'}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="justify-center">
					<p className="text-sm text-muted-foreground">
						Sudah punya akun?{' '}
						<Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
							Masuk sekarang
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	</div>
	)
}
