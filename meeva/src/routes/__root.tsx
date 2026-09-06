import { useLayoutEffect } from 'react'
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { AppShell } from '@/components/app-shell'
import { PortfolioShell } from '@/components/features/portfolio/portfolio-shell'
import '@/index.css'

function isMeevaPath(pathname: string) {
  return (
    pathname === '/meeva' ||
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/soon')
  )
}

function Root() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const meeva = isMeevaPath(pathname)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = meeva ? 'meeva' : 'portfolio'
  }, [meeva])

  if (meeva) {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    )
  }

  return (
    <PortfolioShell>
      <Outlet />
    </PortfolioShell>
  )
}

export const Route = createRootRoute({ component: Root })
