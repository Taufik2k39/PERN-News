import ResponsiveNavLink from "@/components/ResponsiveNavLink"
import { Card } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { clearAuthToken } from './services/api'
import { Calendar } from "@/components/ui/calendar"
import { useTheme } from "@/composable/useTheme"
import { Newspaper } from "lucide-react"

function Sidebar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    clearAuthToken()
    navigate('/login')
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-white/35 
    bg-linear-to-r from-yellow-500/50 via-green-500/50 to-teal-500/50 px-2 py-2 text-white shadow-lg backdrop-blur 
    md:inset-x-auto md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-t-0 
    md:bg-linear-to-b md:from-yellow-500/50 md:via-green-500/50 md:to-teal-500/50 md:p-4 
    dark:border-white/10 dark:from-cyan-500/50 dark:via-blue-500/50 dark:to-indigo-500/50">

      <div className="hidden items-center gap-2 mb-4 md:mb-6 md:flex">
       <Newspaper className="h-6 w-6 text-white/80 md:h-8 md:w-8" />
        <span className="hidden md:inline text-4xl font-bold tracking-wide bg-clip-text text-white">
          Bloggy
        </span>
      </div>

      <nav className="grid grid-cols-5 gap-2 md:grid-cols-1 md:gap-3">
        <Card className="border-white/20 bg-white/15 p-1 text-white md:p-2">
          <ResponsiveNavLink to="/" className="px-2 py-2 text-center text-xs font-semibold md:px-3 md:text-left md:text-sm">Home</ResponsiveNavLink>
        </Card>
        <Card className="border-white/20 bg-white/15 p-1 text-white md:p-2">
          <ResponsiveNavLink to="/create" className="px-2 py-2 text-center text-xs font-semibold md:px-3 md:text-left md:text-sm">Create</ResponsiveNavLink>
        </Card>
        <Card className="border-white/20 bg-white/15 p-1 text-white md:p-2">
          <ResponsiveNavLink to="/me" className="px-2 py-2 text-center text-xs font-semibold md:px-3 md:text-left md:text-sm">Profile</ResponsiveNavLink>
        </Card>
        <Card className="border-white/20 bg-white/15 p-1 text-white md:p-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md px-2 py-2 text-center text-xs font-semibold transition-colors hover:bg-white/20 md:px-3 md:text-left md:text-sm"
          >
            Logout
          </button>
        </Card>
        <Card className="border-white/20 bg-white/15 p-1 text-white md:p-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full rounded-md px-2 py-2 text-center text-xs font-semibold transition-colors hover:bg-white/20 md:px-3 md:text-left md:text-sm"
          >
            <span className="md:hidden">{theme === "dark" ? "Light" : "Dark"}</span>
            <span className="hidden md:inline">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </Card>

        <Card className="hidden border-white/20 bg-white/15 p-2 text-white md:mt-3 md:block">
          <Calendar className="w-full rounded-xl bg-white/10" />
        </Card>
      </nav>
    </aside>
  )
}

export default Sidebar
