import { cn } from "@/lib/utils"
import { NavLink } from 'react-router-dom'

function ResponsiveNavLink({ to = '/', className, children, ...props }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'block w-full rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-green-400 text-white dark:bg-indigo-400 dark:text-white'
            : 'text-white/90 hover:bg-green-300 hover:text-white dark:hover:bg-indigo-300 dark:hover:text-white',
          className,
        )
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}

export default ResponsiveNavLink