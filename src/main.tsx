import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Star,
  X,
} from 'lucide-react';
import './styles.css';

type Page = 'home' | 'about' | 'services' | 'faq' | 'contact';

type Service = {
  name: string;
  intro: string;
  detail: string;
  image: string;
  imageAlt: string;
  accent: string;
  scope: string[];
};

const whatsappNumber = '+2348115112243';
const whatsapp = 'https://wa.me/2348115112243';
const phone = '+2347076967302';
const phoneDisplay = '0707 696 7302';

const navigation: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Services', page: 'services' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
];

const services: Service[] = [
  {
    name: 'Residential cleaning',
    intro: 'Routine and detailed care for apartments, duplexes, and family homes.',
    detail: 'A refined home cleaning service for busy households that want a calm, fresh, well-kept space without the stress of managing every detail.',
    image: 'service-residential',
    imageAlt: 'A bright, uncluttered living room with natural wood furniture',
    accent: 'Living spaces',
    scope: ['Bedrooms and living areas', 'Kitchen surfaces', 'Bathrooms', 'Dusting and floor care'],
  },
  {
    name: 'Office and commercial cleaning',
    intro: 'Quiet, consistent cleaning for productive workspaces and client-facing rooms.',
    detail: 'Designed for offices, studios, salons, shops, and small commercial spaces that need reliable upkeep with a polished finish.',
    image: 'service-office',
    imageAlt: 'An orderly contemporary office with clean desks and seating',
    accent: 'Work spaces',
    scope: ['Desks and common areas', 'Restrooms', 'Reception zones', 'Scheduled maintenance'],
  },
  {
    name: 'Deep cleaning',
    intro: 'Focused reset cleans for spaces that need more than the everyday touch.',
    detail: 'A more intensive service for neglected corners, seasonal refreshes, and homes preparing for visitors, events, or new routines.',
    image: 'service-deep-clean',
    imageAlt: 'A cleaner in work overalls scrubbing a kitchen wall with a brush',
    accent: 'Reset cleans',
    scope: ['Detailed surface cleaning', 'Corners and edges', 'Cabinets exterior', 'Appliance exterior care'],
  },
  {
    name: 'Move in and move out cleaning',
    intro: 'Start fresh or hand over confidently with a room-by-room cleaning plan.',
    detail: 'A practical clean for tenants, landlords, agents, and homeowners preparing a space for the next chapter.',
    image: 'service-move',
    imageAlt: 'An empty apartment with clean floors ready for a fresh start',
    accent: 'Transitions',
    scope: ['Empty home refresh', 'Bathroom and kitchen focus', 'Dust and debris removal', 'Final walkthrough'],
  },
  {
    name: 'Post-construction cleaning',
    intro: 'Dust, residue, and finishing cleanup after renovation or building work.',
    detail: 'A careful post-project service that helps reveal the finished space after contractors have packed up.',
    image: 'service-after-build',
    imageAlt: 'A finished white kitchen with polished surfaces and cabinetry',
    accent: 'After build',
    scope: ['Fine dust reduction', 'Window and glass wipe-down', 'Floor cleanup', 'Surface detailing'],
  },
  {
    name: 'Upholstery and glass care',
    intro: 'Special attention for fabric pieces, windows, mirrors, and glass surfaces.',
    detail: 'Add-on care for the elements that make a room feel visibly bright, comfortable, and complete.',
    image: 'service-upholstery',
    imageAlt: 'A cleaner polishing a glass window with a microfibre cloth',
    accent: 'Details',
    scope: ['Sofa and chair refresh', 'Mirror cleaning', 'Glass panels', 'Spot attention'],
  },
];

const faqs = [
  ['How do I request a quote?', 'Use the quote button, choose the service you need, and share a short note about your space. Your enquiry opens in WhatsApp so you can review and send it.'],
  ['How much does a clean cost?', 'Your quote depends on the size and condition of the space, your location, and the work required. Share those details and we will confirm the scope and price before you book.'],
  ['Do I need to provide supplies?', 'Mention any product preferences, special surfaces, or supplies available when you enquire. The team will confirm what is needed for your clean.'],
  ['Can I book recurring cleaning?', 'Yes. Recurring home or office cleaning can be discussed after the first enquiry so the schedule fits your space and routine.'],
  ['Do you clean offices?', 'Yes. We clean offices, studios, shops, and other commercial spaces. Tell us about your workspace and preferred hours so we can agree on a suitable plan.'],
  ['Which areas do you cover?', 'Send your location with your enquiry. We will confirm whether we can reach your address and discuss availability before you book.'],
  ['How should I prepare for a clean?', 'Put away valuables and loose personal items, arrange access to the space, and let us know about delicate surfaces or priority areas before the visit.'],
];

function Photo({ image, alt, priority = false, sizes = '(max-width: 760px) 100vw, 50vw' }: { image: string; alt: string; priority?: boolean; sizes?: string }) {
  return <img
    src={`/assets/photos/${image}.webp`}
    srcSet={`/assets/photos/${image}-small.webp 640w, /assets/photos/${image}.webp 1600w`}
    sizes={sizes}
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined}
    decoding="async"
  />;
}

function pageFromPath(pathname: string): Page {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  if (!slug) return 'home';
  return navigation.some(item => item.page === slug) ? (slug as Page) : 'home';
}

function BrandMark() {
  return (
    <a className="brand" href="/" aria-label="NeatNest Services home" data-link="home">
      <img src="/assets/neatnest-logo.svg" alt="" className="brand-logo" />
      <span>
        <strong>NeatNest</strong>
        <small>Services</small>
      </span>
    </a>
  );
}

function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(location.pathname));
  const [menu, setMenu] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0].name);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menu) return;
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeMenu);
    return () => document.removeEventListener('keydown', closeMenu);
  }, [menu]);

  const currentTitle = useMemo(() => {
    const match = navigation.find(item => item.page === page);
    return match?.label ?? 'Home';
  }, [page]);

  useEffect(() => {
    const onPopState = () => {
      setPage(pageFromPath(location.pathname));
      setMenu(false);
      setQuoteOpen(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = page === 'home' ? 'NeatNest Services | Spotless care for every space.' : `${currentTitle} | NeatNest Services`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#123f3a');
  }, [currentTitle, page]);

  useEffect(() => {
    if (quoteOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = '';
      lastFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [quoteOpen]);

  function goTo(next: Page, event?: React.MouseEvent<HTMLElement>) {
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event?.preventDefault();
    setPage(next);
    setMenu(false);
    const nextPath = next === 'home' ? '/' : `/${next}`;
    if (location.pathname !== nextPath) history.pushState({}, '', nextPath);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openQuote(serviceName?: string, trigger?: HTMLElement | null) {
    if (serviceName) setSelectedService(serviceName);
    lastFocusRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    setMenu(false);
    setQuoteOpen(true);
  }

  function whatsappHref(message: string) {
    return `${whatsapp}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="topbar">
          <span>Spotless care for every space.</span>
          <a href={`tel:${phone}`}><Phone size={13} /> {phoneDisplay}</a>
          <a href={`${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={13} /> WhatsApp</a>
        </div>
        <div className="nav-wrap">
          <BrandMark />
          <nav id="main-navigation" className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">
            {navigation.map(item => (
              <a
                key={item.page}
                href={item.page === 'home' ? '/' : `/${item.page}`}
                data-link={item.page}
                aria-current={page === item.page ? 'page' : undefined}
                onClick={event => goTo(item.page, event)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button className="button nav-cta" onClick={event => openQuote(undefined, event.currentTarget)}>
            Get a quote <ArrowUpRight size={16} />
          </button>
          <button ref={menuButtonRef} className="icon-button menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-controls="main-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        {page === 'home' && <HomePage goTo={goTo} openQuote={openQuote} />}
        {page === 'about' && <AboutPage openQuote={openQuote} />}
        {page === 'services' && <ServicesPage openQuote={openQuote} />}
        {page === 'faq' && <FaqPage openFaq={openFaq} setOpenFaq={setOpenFaq} openQuote={openQuote} />}
        {page === 'contact' && <ContactPage openQuote={openQuote} whatsappHref={whatsappHref} />}
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <BrandMark />
            <p>Spotless care for every space.</p>
          </div>
          <div>
            <strong>Explore</strong>
            {navigation.slice(1).map(item => (
              <a key={item.page} href={`/${item.page}`} onClick={event => goTo(item.page, event)}>{item.label}</a>
            ))}
          </div>
          <div>
            <strong>Services</strong>
            {services.map(service => (
              <button key={service.name} onClick={event => openQuote(service.name, event.currentTarget)}>{service.name}</button>
            ))}
          </div>
          <div>
            <strong>Contact</strong>
            <a href={`tel:${phone}`}><Phone size={15} /> {phoneDisplay}</a>
            <a href={`${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> {whatsappNumber}</a>
            <span><MapPin size={15} /> Service area confirmed on enquiry</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NeatNest Services.</span>
          <span>A little more care. A little more calm.</span>
        </div>
      </footer>

      <dialog ref={dialogRef} className="quote-dialog" aria-labelledby="quote-title" onCancel={() => setQuoteOpen(false)}>
        <button className="icon-button dialog-close" aria-label="Close quote form" onClick={() => setQuoteOpen(false)}><X /></button>
        <span className="eyebrow">Request a quote</span>
        <h2 id="quote-title">Tell us what needs care.</h2>
        <p>Your message will open in WhatsApp. You can review it before sending.</p>
        <form onSubmit={event => {
          event.preventDefault();
          const message = `Hello NeatNest Services. My name is ${name.trim()}. I would like a quote for ${selectedService.toLowerCase()}.${details.trim() ? `\n\nAbout my space: ${details.trim()}` : ''}\n\nPlease confirm availability and the service cost.`;
          window.open(whatsappHref(message), '_blank', 'noopener,noreferrer');
        }}>
          <label>
            Your name
            <input required autoComplete="name" placeholder="What should we call you?" value={name} onChange={event => setName(event.target.value)} maxLength={80} pattern=".*\S.*" />
          </label>
          <label>
            Service
            <select value={selectedService} onChange={event => setSelectedService(event.target.value)}>
              {services.map(service => <option key={service.name}>{service.name}</option>)}
            </select>
          </label>
          <label>
            A little about your space <span>(optional)</span>
            <textarea placeholder="Location, size, preferred date, or special notes" value={details} onChange={event => setDetails(event.target.value)} maxLength={1200} rows={4} />
          </label>
          <button className="button" type="submit"><MessageCircle size={18} /> Continue to WhatsApp</button>
          <small>Prefer calling? <a href={`tel:${phone}`}>{phoneDisplay}</a></small>
        </form>
      </dialog>
    </div>
  );
}

function HomePage({ goTo, openQuote }: { goTo: (page: Page, event?: React.MouseEvent<HTMLElement>) => void; openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <Photo image="home-living" alt="A sunlit living room opening onto a green garden" priority sizes="100vw" />
        </div>
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={14} /> Premium cleaning care</span>
          <h1>NeatNest <span>Services</span></h1>
          <p className="hero-tagline">Spotless care for every space.</p>
          <p>Thoughtful cleaning for the place you call home, the space you work in, and every fresh start.</p>
          <div className="hero-actions">
            <button className="button" onClick={event => openQuote(undefined, event.currentTarget)}>Request a quote <ArrowUpRight size={17} /></button>
            <a className="ghost-link" href="/services" onClick={event => goTo('services', event)}>View services <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <StatsBand />
      <FeaturedServices openQuote={openQuote} />
      <section className="split-section">
        <div>
          <span className="eyebrow">Why NeatNest</span>
          <h2>Designed for people who notice the details.</h2>
        </div>
        <div className="feature-list">
          {[
            ['Clear from the start', 'Your priorities, the work involved, and the price agreed before cleaning day.'],
            ['Care in the details', 'From frequently touched surfaces to the corners that are easy to miss.'],
            ['A clean that fits your life', 'A one-off refresh or regular care, planned around your home or workspace.'],
          ].map(([title, text]) => (
            <article key={title}>
              <Check size={19} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBlock openQuote={openQuote} />
    </>
  );
}

function AboutPage({ openQuote }: { openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void }) {
  return (
    <>
      <PageHero eyebrow="About NeatNest" title="Good care. A calmer space." text="We believe a well-kept space makes room for a better day. NeatNest brings thoughtful cleaning to the places where life and work happen." image="about-care" imageAlt="A woman carefully wiping a dining table in a bright kitchen" />
      <section className="content-grid">
        <div>
          <span className="eyebrow">Our approach</span>
          <h2>Spotless care for every space.</h2>
          <p>A home is personal. A workspace is a first impression. We approach both with the same care: listen to what matters, agree on the details, and give every room the attention it needs.</p>
        </div>
        <div className="values-grid">
          {[
            ['Thoughtful', 'Attention to your belongings, surfaces, and the little details.'],
            ['Clear', 'An agreed scope and price, with room to ask questions.'],
            ['Flexible', 'One-off and recurring care for different spaces and routines.'],
            ['Personal', 'A conversation about your needs, with your priorities at the centre.'],
          ].map(([title, text]) => (
            <article key={title}>
              <Star size={17} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="process-strip">
        {[
          ['01', 'Listen', 'We understand the space, priority areas, and timeline.'],
          ['02', 'Plan', 'We recommend the right service scope and confirm details.'],
          ['03', 'Care', 'The clean is handled with attention to surfaces and flow.'],
          ['04', 'Finish', 'A final look makes sure the space feels refreshed.'],
        ].map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <CtaBlock openQuote={openQuote} />
    </>
  );
}

function ServicesPage({ openQuote }: { openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void }) {
  return (
    <>
      <PageHero eyebrow="Our services" title="Cleaning care for the way you live." text="From an everyday refresh to a thorough reset. Find the care your space needs, with the details agreed before we begin." image="services-kitchen" imageAlt="A spacious modern kitchen with a clean island and white cabinetry" />
      <section className="service-page-grid">
        {services.map(service => (
          <article className="service-detail-card" key={service.name}>
            <Photo image={service.image} alt={service.imageAlt} />
            <div>
              <span>{service.accent}</span>
              <h2>{service.name}</h2>
              <p>{service.detail}</p>
              <ul>
                {service.scope.map(item => <li key={item}><Check size={15} /> {item}</li>)}
              </ul>
              <button className="text-button" onClick={event => openQuote(service.name, event.currentTarget)}>Ask about this service <ArrowUpRight size={16} /></button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function FaqPage({ openFaq, setOpenFaq, openQuote }: { openFaq: number | null; setOpenFaq: (value: number | null) => void; openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void }) {
  return (
    <>
      <PageHero eyebrow="A few useful details" title="Clear answers. An easier start." text="Everything from planning your first clean to arranging regular care. For anything else, we're a message away." image="faq-glass" imageAlt="A cleaner in work overalls holding a cleaning tool beside a window" />
      <section className="faq-wrap">
        {faqs.map(([question, answer], index) => (
          <article className={openFaq === index ? 'faq-item expanded' : 'faq-item'} key={question}>
            <button aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              {question}
              <ChevronDown size={20} />
            </button>
            <div id={`faq-answer-${index}`} hidden={openFaq !== index}>
              <p>{answer}</p>
            </div>
          </article>
        ))}
      </section>
      <CtaBlock openQuote={openQuote} />
    </>
  );
}

function ContactPage({ openQuote, whatsappHref }: { openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void; whatsappHref: (message: string) => string }) {
  return (
    <>
      <PageHero eyebrow="Let's talk" title="A fresh start begins here." text="Tell us a little about your space. We'll help you choose the right service and confirm the details together." image="contact-window" imageAlt="A cleaner carefully finishing a large glass window" />
      <section className="contact-grid">
        <article>
          <MessageCircle size={24} />
          <h2>WhatsApp</h2>
          <p>Start with a quick message about the service you need, your location, and preferred timing.</p>
          <a className="button" href={whatsappHref('Hello NeatNest Services. I would like to enquire about cleaning services.')} target="_blank" rel="noreferrer">Send a message <ArrowUpRight size={16} /></a>
        </article>
        <article>
          <Phone size={24} />
          <h2>Phone</h2>
          <p>Prefer a conversation? Let's talk through your space, your priorities, and a suitable time.</p>
          <a className="button secondary" href={`tel:${phone}`}><Phone size={16} /> {phoneDisplay}</a>
        </article>
        <article>
          <CalendarCheck size={24} />
          <h2>Your next clean</h2>
          <p>Have a service in mind? Share your location, the size of your space, and your preferred date.</p>
          <button className="button secondary" onClick={event => openQuote(undefined, event.currentTarget)}>Request a quote <ArrowUpRight size={16} /></button>
        </article>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, text, image, imageAlt }: { eyebrow: string; title: string; text: string; image: string; imageAlt: string }) {
  return (
    <section className="page-hero">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <Photo image={image} alt={imageAlt} priority sizes="100vw" />
    </section>
  );
}

function StatsBand() {
  const stats = [
    [<Home size={20} />, 'Homes', 'Everyday and deep cleaning care'],
    [<ShieldCheck size={20} />, 'Workspaces', 'Office and commercial upkeep'],
    [<CalendarCheck size={20} />, 'Flexible', 'One-off and recurring enquiries'],
    [<Clock3 size={20} />, 'Personal', 'Care planned around your priorities'],
  ];

  return (
    <section className="stats-band" aria-label="Service highlights">
      {stats.map(([icon, title, text]) => (
        <article key={String(title)}>
          {icon}
          <strong>{title}</strong>
          <span>{text}</span>
        </article>
      ))}
    </section>
  );
}

function FeaturedServices({ openQuote }: { openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void }) {
  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">Core services</span>
        <h2>Every space deserves<br />a little extra care.</h2>
      </div>
      <div className="service-grid">
        {services.slice(0, 3).map((service, index) => (
          <article className="service-card" key={service.name}>
            <Photo image={['home-residential', 'home-office', 'home-deep-clean'][index]} alt={['A bright contemporary living room with elegant seating', 'A tidy meeting room with colourful chairs', 'A woman vacuuming the floor of a modern living room'][index]} sizes="(max-width: 760px) 100vw, 33vw" />
            <div>
              <span>{service.accent}</span>
              <h3>{service.name}</h3>
              <p>{service.intro}</p>
              <button aria-label={`Enquire about ${service.name.toLowerCase()}`} onClick={event => openQuote(service.name, event.currentTarget)}>Enquire <ArrowUpRight size={15} /></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CtaBlock({ openQuote }: { openQuote: (serviceName?: string, trigger?: HTMLElement | null) => void }) {
  return (
    <section className="cta-block">
      <span className="eyebrow"><SprayCan size={14} /> NeatNest Services</span>
      <h2>Make the next clean feel effortless.</h2>
      <p>Share the space, the service, and the timing. NeatNest will take the conversation from there.</p>
      <button className="button light" onClick={event => openQuote(undefined, event.currentTarget)}>Request a quote <ArrowUpRight size={17} /></button>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
