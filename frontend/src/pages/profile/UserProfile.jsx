import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authApi, clearAuthToken } from '../../services/api'

export default function UserProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const data = await authApi.me()
        setProfile(data)
      } catch (error) {
        setProfile(null)
        setErrorMessage(error.message || 'Gagal memuat profil user.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleBack = () => {
    navigate('/')
  }

  const handleRelogin = () => {
    clearAuthToken()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    const shouldDelete = window.confirm('Yakin ingin menghapus akun ini? Semua post milik akun juga akan terhapus.')

    if (!shouldDelete) {
      return
    }

    try {
      setIsDeleting(true)
      setErrorMessage('')
      await authApi.deleteMe()
      clearAuthToken()
      navigate('/register')
    } catch (error) {
      setErrorMessage(error.message || 'Gagal menghapus akun.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Informasi akun yang sedang login.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? <p className="text-sm text-muted-foreground">Memuat profil...</p> : null}

          {!isLoading && errorMessage ? (
            <div className="space-y-3">
              <p className="text-sm text-red-600">{errorMessage}</p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Kembali
                </Button>
                <Button type="button" onClick={handleRelogin}>
                  Login Ulang
                </Button>
              </div>
            </div>
          ) : null}

          {!isLoading && !errorMessage && profile ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">ID:</span> {profile.id}
              </p>
              <p>
                <span className="font-semibold">Username:</span> {profile.username}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{' '}
                {profile.created_at ? new Date(profile.created_at).toLocaleString('id-ID') : '-'}
              </p>

              <div className="pt-2">
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Kembali ke Home
                  </Button>
                  <Button type="button" onClick={() => navigate('/me/edit')}>
                    Edit Profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Menghapus akun...' : 'Delete Account'}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}