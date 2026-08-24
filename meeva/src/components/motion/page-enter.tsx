import { useRouterState } from '@tanstack/react-router'

export function PageEnter({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <div key={pathname} className="hq-page-enter">
      {children}
    </div>
  )
}
