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
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <Card className="border rounded-xl shadow-sm">
        <CardHeader className="border rounded-t-xl bg-stone-50/70 dark:bg-stone-800">
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Informasi akun yang sedang login.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          {isLoading ? <p className="text-sm text-muted-foreground">Memuat profil...</p> : null}

          {!isLoading && errorMessage ? (
            <div className="space-y-3">
              <p className="text-sm text-red-600">{errorMessage}</p>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Kembali
                </Button>
                <Button type="button" onClick={handleRelogin}>
                  Login Ulang
                </Button>
              </div>
            </div>
          ) : null}
          {/*profile gambar*/}
          {!isLoading && !errorMessage && profile ? (
            <div className="grid gap-6 text-sm md:grid-cols-[220px_1fr] md:items-start">
              <div className="flex flex-col items-center rounded-xl bg-stone-50 p-4 dark:bg-stone-800 ">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="h-36 w-36 rounded-full object-cover ring-4 ring-white shadow"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-700 text-3xl font-semibold text-stone-600">
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">Foto Profil</p>
              </div>

              <div className="space-y-4 rounded-xl border p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="rounded-md bg-stone-50 px-3 py-2 dark:bg-stone-800">
                    <span className="font-semibold text-stone-700">ID:</span> {profile.id}
                  </p>
                  <p className="rounded-md bg-stone-50 px-3 py-2 dark:bg-stone-800">
                    <span className="font-semibold text-stone-700">Username:</span> {profile.username}
                  </p>
                  <p className="rounded-md bg-stone-50 px-3 py-2 sm:col-span-2 dark:bg-stone-800">
                    <span className="font-semibold text-stone-700">Email:</span> {profile.email}
                  </p>
                  <p className="rounded-md bg-stone-50 px-3 py-2 sm:col-span-2 dark:bg-stone-800">
                    <span className="font-semibold text-stone-700">Created At:</span>{' '}
                    {profile.created_at ? new Date(profile.created_at).toLocaleString('id-ID') : '-'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
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
                    {isDeleting ? 'Menghapus akun...' : 'Hapus Akun'}
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