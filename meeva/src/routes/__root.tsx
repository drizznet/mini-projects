import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/app-shell'
import '@/index.css'

export const Route = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})
