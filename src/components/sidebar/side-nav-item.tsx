import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar-store'

interface SideNavItemProps {
  active: boolean
  onClick: () => void
  to: string
  show?: boolean
  children?: React.ReactNode
  className?: string
}

export default function SideNavItem(props: SideNavItemProps) {
  const { collapsed, switchHidden, hidden } = useSidebarStore()
  return (
    <a
      href={props.to}
      className={cn(
        'relative flex cursor-pointer items-center gap-3 rounded border-l-4 border-transparent p-2 hover:bg-[#EBECEF]',
        props.active && 'bg-secondary border-primary hover:bg-secondary',
        collapsed && !hidden && 'md:justify-center',
        !props.show && 'hidden',
        props.className
      )}
      onClick={e => {
        e.preventDefault()
        props.onClick()
        if (!hidden) switchHidden(true)
      }}
    >
      {props.children}
    </a>
  )
}
