import { createFileRoute } from '@tanstack/react-router'
import { PortfolioPage } from '@/components/features/portfolio/portfolio-page'

export const Route = createFileRoute('/')({ component: DrizzHome })

function DrizzHome() {
  return <PortfolioPage />
}
