import { ArrowUp } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <a
      href="#top"
      aria-label="Back to top"
      className="dz-fab fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-lg lg:right-8 lg:bottom-8"
    >
      <ArrowUp className="size-5" weight="bold" />
    </a>
  )
}
