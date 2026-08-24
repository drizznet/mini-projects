import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  CalendarBlank,
  CheckCircle,
  Clock,
  Heart,
  House,
  InstagramLogo,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Sparkle,
  X,
} from '@phosphor-icons/react'

export const Route = createFileRoute('/')({ component: AshloveHome })

const services = [
  [
    '01',
    'Wellness Consultations',
    'A thoughtful check-in that turns your questions into a clear, practical plan.',
    'bg-[#dfeccf]',
  ],
  [
    '02',
    'Family Health Support',
    'Steady guidance for the people you love, through every season of care.',
    'bg-[#f4d9ce]',
  ],
  [
    '03',
    'Post-care Guidance',
    'Feel supported at home with simple next steps and someone in your corner.',
    'bg-[#d7e8e2]',
  ],
]

const feedbacks = [
  {
    name: 'Dami A.',
    detail: 'Wellness consultation',
    quote: 'I felt listened to from the very first minute.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Chioma N.',
    detail: 'Family health support',
    quote: 'Clear answers, kind guidance, and no judgment.',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Maya R.',
    detail: 'Post-care guidance',
    quote: 'The follow-up plan made everything feel manageable.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Tunde O.',
    detail: 'Family health support',
    quote: 'Ashlove gave our family genuine peace of mind.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
]

const Image = ({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) => <img src={src} alt={alt} className={className} />

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-left">
      <span className="grid size-8 place-items-center rounded-full border border-[#e27b65]/40 bg-[#f5d8ce] text-[#e27b65]">
        <Heart weight="fill" className="size-3.5" />
      </span>
      <span>
        <span
          className={`${compact ? 'text-2xl' : 'text-3xl'} block font-serif leading-[.75] font-semibold tracking-[-.1em]`}
        >
          ash<span className="text-[#e8846c]">love</span>
        </span>
        <span className="mt-1 block text-[7px] font-extrabold tracking-[.21em] text-[#55756c]">
          NURSING CONSULTATIONS
        </span>
      </span>
    </span>
  )
}

function AshloveHome() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const headerRef = useRef<HTMLElement>(null)
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const book = () => {
    setMobileMenu(false)
    setBookingOpen(true)
  }
  const submitBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBookingOpen(false)
    setNotice(
      'Thank you — we’ll be in touch shortly to confirm your consultation.'
    )
  }

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!bookingOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setBookingOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [bookingOpen])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f9f7f1] text-[#173c36]">
      <div className="border-b border-[#173c36]/10 bg-[#f3f0e8] px-5 py-2 text-center text-[11px] font-semibold tracking-[.12em] text-[#55756c] sm:text-xs">
        COMPASSIONATE CARE, WHEREVER YOU ARE
      </div>
      <header
        ref={headerRef}
        className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"
      >
        <button onClick={() => scrollTo('top')} aria-label="Ashlove home">
          <BrandMark />
        </button>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#31554e] md:flex">
          <button onClick={() => scrollTo('about')}>About</button>
          <button onClick={() => scrollTo('services')}>Services</button>
          <button onClick={() => scrollTo('how')}>How it works</button>
          <button onClick={() => scrollTo('stories')}>Stories</button>
        </nav>
        <button
          onClick={book}
          className="hidden rounded-full bg-[#173c36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#28554d] md:block"
        >
          Book a consult <ArrowRight className="ml-1 inline size-4" />
        </button>
        <button
          aria-label="Open menu"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-full border border-[#173c36]/15 p-2 md:hidden"
        >
          <Plus
            className={`size-5 transition ${mobileMenu ? 'rotate-45' : ''}`}
          />
        </button>
        {mobileMenu && (
          <div className="absolute top-20 right-5 z-20 flex w-56 flex-col rounded-2xl bg-white p-4 shadow-xl md:hidden">
            <button className="p-3 text-left" onClick={() => scrollTo('about')}>
              About
            </button>
            <button
              className="p-3 text-left"
              onClick={() => scrollTo('services')}
            >
              Services
            </button>
            <button className="p-3 text-left" onClick={() => scrollTo('how')}>
              How it works
            </button>
            <button
              onClick={book}
              className="mt-2 rounded-full bg-[#173c36] p-3 font-bold text-white"
            >
              Book a consult
            </button>
          </div>
        )}
      </header>
      <nav
        aria-label="Floating navigation"
        className={`fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-[1.6rem] border border-white/15 bg-[#173c36]/95 p-2 text-white shadow-2xl shadow-[#173c36]/30 backdrop-blur-md transition-all duration-300 ${headerVisible ? 'pointer-events-none translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <button
          onClick={() => scrollTo('top')}
          className="grid size-10 place-items-center rounded-2xl transition hover:bg-white/12"
          aria-label="Back to top"
        >
          <House className="size-5" />
        </button>
        <span className="h-6 w-px bg-white/15" />
        <button
          onClick={() => scrollTo('about')}
          className="hidden rounded-xl px-3 py-2 text-xs font-bold transition hover:bg-white/12 sm:block"
        >
          About
        </button>
        <button
          onClick={() => scrollTo('services')}
          className="hidden rounded-xl px-3 py-2 text-xs font-bold transition hover:bg-white/12 sm:block"
        >
          Services
        </button>
        <button
          onClick={() => scrollTo('how')}
          className="hidden rounded-xl px-3 py-2 text-xs font-bold transition hover:bg-white/12 sm:block"
        >
          How it works
        </button>
        <button
          onClick={book}
          className="flex items-center gap-2 rounded-2xl bg-[#f6a18d] px-4 py-2.5 text-xs font-extrabold text-[#173c36] transition hover:bg-[#ffc0af]"
        >
          <CalendarBlank className="size-4" />
          <span className="hidden sm:inline">Book a consult</span>
          <span className="sm:hidden">Book</span>
        </button>
      </nav>

      <section
        id="top"
        className="mx-auto grid max-w-7xl gap-10 px-5 pt-8 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pt-16 lg:pb-24"
      >
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-2 text-xs font-bold tracking-[.18em] text-[#d9715c] uppercase">
            <span className="h-px w-8 bg-[#d9715c]" /> Nursing care that feels
            like home
          </div>
          <h1 className="hero-title max-w-2xl font-serif text-5xl leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">
            Good care starts with being{' '}
            <em className="hero-title-accent font-normal text-[#de7c67]">
              heard.
            </em>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#55756c] sm:text-lg">
            Personal nursing consultations for you and your family—kind, clear,
            and built around real life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={book}
              className="rounded-full bg-[#e27b65] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#e27b65]/20 transition hover:-translate-y-0.5"
            >
              Book your consultation{' '}
              <ArrowRight className="ml-2 inline size-4" />
            </button>
            <button
              onClick={() => scrollTo('how')}
              className="rounded-full border border-[#173c36]/20 px-6 py-4 text-sm font-bold"
            >
              How Ashlove helps
            </button>
          </div>
          <div className="social-proof mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <Image
                className="proof-avatar proof-avatar-one size-10 rounded-full border-2 border-[#f9f7f1] object-cover"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Client"
              />
              <Image
                className="proof-avatar proof-avatar-two size-10 rounded-full border-2 border-[#f9f7f1] object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Client"
              />
              <Image
                className="proof-avatar proof-avatar-three size-10 rounded-full border-2 border-[#f9f7f1] object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Client"
              />
            </div>
            <div>
              <div className="text-[#efad4f]">★★★★★</div>
              <p className="text-xs font-medium text-[#55756c]">
                Trusted by 500+ families
              </p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute top-12 -left-5 h-40 w-40 rounded-full bg-[#dceacb]" />
          <div className="absolute -right-3 bottom-8 h-32 w-32 rounded-full bg-[#f2cfc5]" />
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#d5e5dc] p-3 shadow-xl shadow-[#173c36]/10">
            <Image
              className="h-[480px] w-full rounded-[2rem] object-cover object-center"
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=85"
              alt="Nurse warmly consulting with a patient"
            />
            <div className="hero-care-note absolute bottom-8 left-0 flex items-center gap-3 rounded-r-2xl bg-white px-4 py-3 shadow-lg">
              <span className="grid size-10 place-items-center rounded-full bg-[#dfeccf] text-[#37654f]">
                <Heart weight="fill" className="size-5" />
              </span>
              <span className="text-xs leading-4 font-bold">
                Care that meets you
                <br />
                where you are
              </span>
            </div>
          </div>
          <div className="hero-license-note absolute top-7 right-[-12px] rounded-2xl bg-[#173c36] px-4 py-3 text-white shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold">
              <CheckCircle weight="fill" className="size-4 text-[#bddc9a]" />{' '}
              Licensed nurse
            </div>
            <p className="mt-1 text-[10px] text-white/65">
              You’re in safe hands
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#173c36] px-5 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 lg:px-8">
          {[
            ['500+', 'FAMILIES SUPPORTED'],
            ['1:1', 'PERSONALIZED CARE'],
            ['100%', 'HEART-LED APPROACH'],
            ['4.9/5', 'CLIENT RATING'],
          ].map(([big, small]) => (
            <div key={big}>
              <p className="font-serif text-3xl">{big}</p>
              <p className="mt-1 text-xs tracking-wider text-white/60">
                {small}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        aria-label="Client feedback"
        className="overflow-hidden border-b border-[#173c36]/10 bg-[#fdfcf9] py-7"
      >
        <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-extrabold tracking-[.18em] text-[#55756c] uppercase">
          <Heart weight="fill" className="size-3 text-[#e27b65]" /> Words from
          the Ashlove community
        </div>
        <div className="overflow-hidden">
          <div className="feedback-track flex gap-4 px-2">
            {[...feedbacks, ...feedbacks].map((feedback, index) => (
              <article
                key={`${feedback.name}-${index}`}
                className="flex w-[295px] shrink-0 items-center gap-3 rounded-2xl border border-[#173c36]/10 bg-[#fffdf9] p-3 shadow-sm"
              >
                <Image
                  className="size-10 rounded-full object-cover"
                  src={feedback.image}
                  alt={`${feedback.name}, Ashlove client`}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">
                    “{feedback.quote}”
                  </p>
                  <p className="mt-1 text-[10px] text-[#55756c]">
                    <span className="font-bold text-[#e27b65]">
                      {feedback.name}
                    </span>{' '}
                    · {feedback.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-28"
      >
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-x-8 top-8 bottom-[-20px] rounded-[2rem] bg-[#e7d6b5]" />
          <Image
            className="relative h-[450px] w-full rounded-[2rem] object-cover"
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85"
            alt="A caring health professional"
          />
          <div className="absolute -right-2 -bottom-8 max-w-[200px] rounded-2xl bg-[#fdfbf6] p-4 shadow-lg">
            <Sparkle weight="fill" className="mb-2 size-5 text-[#e27b65]" />
            <p className="font-serif text-lg leading-5">
              “Care with a whole lot of heart.”
            </p>
          </div>
        </div>
        <div className="self-center">
          <p className="text-xs font-bold tracking-[.18em] text-[#d9715c] uppercase">
            Meet Ashlove
          </p>
          <h2 className="mt-5 max-w-xl font-serif text-4xl leading-tight tracking-[-.04em] sm:text-5xl">
            A calm presence when health feels overwhelming.
          </h2>
          <p className="mt-6 max-w-xl leading-7 text-[#55756c]">
            Ashlove was created for the moments when you need more than a quick
            answer. We offer warm, clinical nursing guidance that makes space
            for your concerns and equips you to move forward.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 size-5 text-[#e27b65]" />
              <div>
                <h3 className="font-bold">Qualified & caring</h3>
                <p className="mt-1 text-sm leading-5 text-[#55756c]">
                  Professional insight, delivered with empathy.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-1 size-5 text-[#e27b65]" />
              <div>
                <h3 className="font-bold">On your schedule</h3>
                <p className="mt-1 text-sm leading-5 text-[#55756c]">
                  Easy virtual sessions built around you.
                </p>
              </div>
            </div>
          </div>
          <button onClick={book} className="mt-8 font-bold text-[#d9715c]">
            Get to know us <ArrowRight className="ml-1 inline size-4" />
          </button>
        </div>
      </section>
      <section
        id="services"
        className="bg-[#eef2e7] px-5 py-20 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-[#d9715c] uppercase">
                How we can help
              </p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl tracking-[-.04em] sm:text-5xl">
                Support designed around your life.
              </h2>
            </div>
            <button onClick={book} className="font-bold text-[#31554e]">
              Explore all services <ArrowRight className="ml-1 inline size-4" />
            </button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map(([num, title, text, color]) => (
              <article
                key={num}
                className="rounded-3xl bg-[#fdfcf9] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`grid size-12 place-items-center rounded-2xl ${color} font-serif text-lg`}
                >
                  {num}
                </div>
                <h3 className="mt-12 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#55756c]">{text}</p>
                <button
                  onClick={book}
                  aria-label={`Learn about ${title}`}
                  className="mt-7 grid size-10 place-items-center rounded-full border border-[#173c36]/15"
                >
                  <ArrowRight className="size-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="how"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[#d9715c] uppercase">
              Simple by design
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-.04em] sm:text-5xl">
              Care starts with a conversation.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-[#55756c]">
              No confusing process. Just a few gentle steps toward feeling more
              supported and in control.
            </p>
            <button
              onClick={book}
              className="mt-8 rounded-full bg-[#173c36] px-6 py-4 text-sm font-bold text-white"
            >
              Let’s talk <ArrowRight className="ml-1 inline size-4" />
            </button>
          </div>
          <div className="space-y-1">
            {[
              [
                '01',
                'Choose a time that works',
                'Pick a virtual consultation slot that fits your day.',
              ],
              [
                '02',
                'Tell us what’s on your mind',
                'Share a little context so we can prepare for your conversation.',
              ],
              [
                '03',
                'Leave with clarity',
                'Get practical guidance and next steps you can feel good about.',
              ],
            ].map(([num, title, text]) => (
              <div
                key={num}
                className="flex gap-5 border-b border-[#173c36]/12 py-6 first:pt-0"
              >
                <span className="font-serif text-xl text-[#e27b65]">{num}</span>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#55756c]">
                    {text}
                  </p>
                </div>
                <Plus className="mt-1 ml-auto size-5 text-[#55756c]" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="stories" className="bg-[#f5d8ce] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[#bd5b48] uppercase">
              Kind words
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-.04em] sm:text-5xl">
              Care you can feel.
            </h2>
            <div className="mt-8 flex gap-2">
              <button className="grid size-10 place-items-center rounded-full border border-[#173c36]/15">
                ←
              </button>
              <button className="grid size-10 place-items-center rounded-full bg-[#173c36] text-white">
                →
              </button>
            </div>
          </div>
          <blockquote className="rounded-[2rem] bg-[#fffaf6] p-8 sm:p-10">
            <div className="text-[#efad4f]">★★★★★</div>
            <p className="mt-6 font-serif text-2xl leading-snug sm:text-3xl">
              “Ashlove made a hard season feel lighter. I left our consultation
              with answers, confidence, and the feeling that someone truly
              cared.”
            </p>
            <footer className="mt-8 flex items-center gap-3">
              <Image
                className="size-11 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Dami"
              />
              <div>
                <p className="text-sm font-bold">Dami A.</p>
                <p className="text-xs text-[#55756c]">Consultation client</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#173c36] px-7 py-14 text-center text-white sm:px-14">
          <Heart weight="fill" className="mx-auto size-8 text-[#f7a38f]" />
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl tracking-[-.04em] sm:text-5xl">
            Ready for care that feels a little more human?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/70">
            Your questions matter. Let’s make space for them, together.
          </p>
          <button
            onClick={book}
            className="mt-8 rounded-full bg-[#f6a18d] px-6 py-4 text-sm font-bold text-[#173c36]"
          >
            Book a consultation <ArrowRight className="ml-1 inline size-4" />
          </button>
        </div>
      </section>
      <footer className="border-t border-[#173c36]/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row">
          <div>
            <BrandMark compact />
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#55756c]">
              Nursing support that puts you and your family first.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <p className="font-bold">Connect</p>
              <a
                href="tel:+2348000000000"
                className="mt-3 flex items-center gap-2 text-[#55756c]"
              >
                <Phone className="size-4" /> Call us
              </a>
              <p className="mt-2 flex items-center gap-2 text-[#55756c]">
                <MapPin className="size-4" /> Available virtually
              </p>
            </div>
            <div>
              <p className="font-bold">Follow along</p>
              <a
                href="#top"
                className="mt-3 flex items-center gap-2 text-[#55756c]"
              >
                <InstagramLogo className="size-4" /> @ashlovecare
              </a>
            </div>
          </div>
        </div>
      </footer>
      {notice && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#173c36] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {notice}
          <button onClick={() => setNotice('')} className="ml-3 text-white/70">
            <X className="inline size-4" />
          </button>
        </div>
      )}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-[#173c36]/50 md:items-center md:p-4"
          onClick={() => setBookingOpen(false)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onSubmit={submitBooking}
            onClick={(event) => event.stopPropagation()}
            className="booking-panel relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-[#fffdf9] px-6 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-2xl md:max-w-md md:rounded-3xl md:p-7"
          >
            <div
              className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#173c36]/15 md:hidden"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => setBookingOpen(false)}
              className="absolute top-5 right-5 text-[#55756c]"
              aria-label="Close consultation form"
            >
              <X className="size-5" />
            </button>
            <p className="text-xs font-bold tracking-[.16em] text-[#d9715c] uppercase">
              Start here
            </p>
            <h2 id="booking-title" className="mt-3 font-serif text-3xl">
              Book your consultation
            </h2>
            <p className="mt-2 text-sm text-[#55756c]">
              Share your details and we’ll find a time that feels right.
            </p>
            <label className="mt-6 block text-xs font-bold">
              YOUR NAME
              <input
                required
                className="mt-2 w-full rounded-xl border border-[#173c36]/15 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#e27b65]"
                placeholder="Jane Doe"
              />
            </label>
            <label className="mt-4 block text-xs font-bold">
              EMAIL ADDRESS
              <input
                required
                type="email"
                className="mt-2 w-full rounded-xl border border-[#173c36]/15 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#e27b65]"
                placeholder="you@example.com"
              />
            </label>
            <label className="mt-4 block text-xs font-bold">
              WHAT WOULD YOU LIKE SUPPORT WITH?
              <select className="mt-2 w-full rounded-xl border border-[#173c36]/15 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#e27b65]">
                <option>Wellness consultation</option>
                <option>Family health support</option>
                <option>Post-care guidance</option>
                <option>Something else</option>
              </select>
            </label>
            <button className="mt-6 w-full rounded-full bg-[#e27b65] px-5 py-4 text-sm font-bold text-white">
              Request a consultation{' '}
              <ArrowRight className="ml-1 inline size-4" />
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
