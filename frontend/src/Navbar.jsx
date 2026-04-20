import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import ResponsiveNavLink from "@/components/ResponsiveNavLink"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authApi, getAuthToken } from "@/src/services/api"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState("")
  const [contextText, setContextText] = useState("Memuat profil...")
  const [searchTerm, setSearchTerm] = useState(
    () => new URLSearchParams(location.search).get("search") || ""
  )

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

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const params = new URLSearchParams()
    const keyword = searchTerm.trim()

    if (keyword) {
      params.set("search", keyword)
    }

    navigate({
      pathname: "/",
      search: params.toString() ? `?${params.toString()}` : "",
    })
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    navigate("/")
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/35 bg-linear-to-r from-yellow-500/50 via-green-500/50 to-teal-500/50 px-4 py-3 shadow-md backdrop-blur md:left-64 md:h-16 md:px-6 md:py-0 dark:border-white/10 dark:from-cyan-500/50 dark:via-blue-500/50 dark:to-indigo-500/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 md:h-full">
        <div className="flex min-w-0 items-center gap-3">
          <div className="truncate text-base font-semibold text-white md:text-lg">
            {username ? `Halo, ${username}` : "Halo"}
          </div>
          <Separator orientation="vertical" className="hidden h-6 bg-white/45 sm:block" />
          <div className="text-xs text-white/85 sm:text-sm">
            {contextText}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 md:w-80 lg:w-96">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/75" />
              <Input
                type="search"
                placeholder="Cari judul atau isi berita..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 border-white/30 bg-white/15 pl-9 pr-9 text-sm text-white placeholder:text-white/70 focus-visible:ring-white/60"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="border border-white/30 bg-white/15 text-white hover:bg-white/25"
            >
              Cari
            </Button>
          </form>

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
      </div>
    </header>
  )
}

export default Navbar