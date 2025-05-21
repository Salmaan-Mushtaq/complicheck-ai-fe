import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { useSidebarStore } from '@/stores/sidebar-store'

export default function SidebarMobile({
  children
}: {
  children: React.ReactNode
}) {
  const { hidden, switchHidden, setActiveGroup } = useSidebarStore()
  const pathName = location.pathname.split('/')[1]
  const determineInitialActiveGroup = () => {
    if (['clients', 'parents'].includes(pathName)) return 'general'
    if (['stops', 'schools', 'vehicles', 'route-directions'].includes(pathName))
      return 'operations'
    if (
      [
        'day-passes',
        'standing-orders',
        'client-payments',
        'scan-logs',
        'live-tracking',
        'web-import'
      ].includes(pathName)
    )
      return 'users-devices'
    if (['email-template', 'alert', 'sms', 'web-portal'].includes(pathName))
      return 'communication'
    if (['users', 'device-access'].includes(pathName)) return 'user-devices'
    return 'general'
  }
  return (
    <Sheet
      open={!hidden}
      onOpenChange={status => {
        switchHidden(!status)
        setActiveGroup(determineInitialActiveGroup())
      }}
    >
      <SheetContent side="left" className="w-72 focus-visible:outline-none">
        <SheetHeader className="sr-only">
          <SheetTitle />
          <SheetDescription />
        </SheetHeader>
        <aside className="flex h-full flex-col overflow-y-auto">
          <nav className="flex-1 p-6">{children}</nav>
        </aside>
      </SheetContent>
    </Sheet>
  )
}
