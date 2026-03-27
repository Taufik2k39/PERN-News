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

export default function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (!email || !password) {
			setErrorMessage('Email dan password wajib diisi.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')
			await authApi.login({ email, password })
			navigate('/')
		} catch (error) {
			setErrorMessage(error.message || 'Login gagal. Silakan coba lagi.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
	<div className='bg-linear-to-br from-emerald-300 via-teal-300 to-blue-300 dark:from-cyan-700 dark:via-sky-700 dark:to-blue-700 min-h-screen flex items-center justify-center'>
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Masuk ke akun Anda untuk melanjutkan.</CardDescription>
				</CardHeader>

				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
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
								placeholder="Masukkan password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>

						{errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? 'Memproses...' : 'Masuk'}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="justify-center">
					<p className="text-sm text-muted-foreground">
						Belum punya akun?{' '}
						<Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
							Daftar sekarang
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	</div>
	)
}
