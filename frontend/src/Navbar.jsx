import { useEffect, useState } from "react"
import ResponsiveNavLink from "@/components/ResponsiveNavLink"
import { Separator } from "@/components/ui/separator"
import { authApi, getAuthToken } from "@/src/services/api"

function Navbar() {
  const [username, setUsername] = useState("")
  const [contextText, setContextText] = useState("Memuat profil...")

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken()

      if (!token) {
        setUsername("")
        setContextText("Belum login")
        return
      }

      try {
        const user = await authApi.me()
        setUsername(user?.username || "User")
        setContextText("Login berhasil")
      } catch {
        setUsername("")
        setContextText("Gagal mengambil profil")
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-white/35 
    bg-linear-to-r from-yellow-500/50 via-green-500/50 to-teal-500/50 px-4 shadow-md backdrop-blur md:left-64 md:px-6 
    dark:border-white/10 dark:from-cyan-500/50 dark:via-blue-500/50 dark:to-indigo-500/50">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="truncate text-base font-semibold text-white md:text-lg">
            {username ? `Halo, ${username}` : "Halo"}
          </div>
          <Separator orientation="vertical" className="hidden h-6 bg-white/45 sm:block" />
          <div className="hidden text-sm text-white/85 sm:block">
            {contextText}
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <ResponsiveNavLink
            to="/"
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
          >
            Home
          </ResponsiveNavLink>
          <ResponsiveNavLink
            to="/about"
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
          >
            About
          </ResponsiveNavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar