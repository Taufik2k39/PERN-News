import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-green-300 via-emerald-300 to-teal-300 text-stone-900
     dark:from-cyan-800 dark:via-sky-800 dark:to-blue-800 dark:text-white">
      <Sidebar />
      <Navbar />

      <main className="min-h-screen px-4 pb-24 pt-32 md:pb-8 md:pl-64 md:pr-8 md:pt-20 lg:pr-10">
        <section className="mx-auto w-full max-w-7xl rounded-3xl border border-white/40 bg-white/45 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/35 md:p-6 lg:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default Layout
