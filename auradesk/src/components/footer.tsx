import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { ChevronDown, Globe } from 'lucide-react'

const columns = [
  {
    title: siteConfig.name,
    links: [
      { label: `About ${siteConfig.name}`, href: siteConfig.routes.home },
      { label: 'Our Story', href: siteConfig.routes.home },
      { label: 'Sustainability', href: siteConfig.routes.home },
      { label: 'Careers', href: siteConfig.routes.home },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { label: 'Shop Catalog', href: siteConfig.routes.shop },
      { label: 'Admin Panel', href: siteConfig.routes.admin },
      { label: 'Asset Manager', href: siteConfig.routes.adminAssets },
      { label: 'Partner Makers', href: siteConfig.routes.shop },
      { label: 'Affiliates', href: siteConfig.routes.home },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Workspace Guides', href: siteConfig.routes.home },
      { label: 'Setup Inspiration', href: siteConfig.routes.home },
      { label: 'Compare Gear', href: siteConfig.routes.shop },
      { label: 'Free Tools', href: siteConfig.routes.home },
      { label: 'Changelog', href: siteConfig.routes.home },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: siteConfig.routes.home },
      { label: 'Shipping & Returns', href: siteConfig.routes.home },
      { label: 'Contact Us', href: siteConfig.routes.home },
      { label: 'Service Status', href: siteConfig.routes.home },
    ],
  },
]

const legalLinks = [
  { label: 'Terms of Service', href: siteConfig.routes.home },
  { label: 'Legal', href: siteConfig.routes.home },
  { label: 'Privacy Policy', href: siteConfig.routes.home },
  { label: 'Sitemap', href: siteConfig.routes.home },
  { label: 'Your Privacy Choices', href: siteConfig.routes.home },
]

function SocialIcon({ children, label, href }: { children: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 lg:gap-x-10">
          <div className="col-span-2 md:col-span-1">
            <Link href={siteConfig.routes.home} className="text-xl font-bold tracking-tight text-white">
              {siteConfig.name}
            </Link>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-bold text-white">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <Globe className="h-4 w-4" />
            United States | English
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-neutral-400 transition-colors hover:text-white sm:text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-2">
            <SocialIcon label="Facebook" href="https://facebook.com">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="X" href="https://x.com">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="YouTube" href="https://youtube.com">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Pinterest" href="https://pinterest.com">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.057 23.812 10.488 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  )
}
