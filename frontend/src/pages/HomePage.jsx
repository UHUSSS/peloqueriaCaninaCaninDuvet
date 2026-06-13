import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import {
  Scissors, Heart, Star, Phone, MapPin, Clock, ChevronRight,
  Sparkles, ShieldCheck, PawPrint, Stethoscope, Bath, Brush,
  ChevronLeft, Globe, Mail, MessageCircle, LogIn, Menu, X
} from 'lucide-react';

// ─── Datos del negocio ────────────────────────────────────
const BUSINESS = {
  name: 'Canin Duvet',
  tagline: 'Clínica / SPA / Peluquería',
  phone: '(02) 2668142',
  mobile: '098 4663 656',
  address: 'Jumandi OE 26 66, Jacinto Flores, tras el C.C. Recreo',
  hours: 'Lun - Sáb: 9:00 AM - 6:00 PM',
  email: 'info@caninduvet.com',
};

const SERVICES = [
  { icon: Scissors, title: 'Peluquería Canina', desc: 'Cortes de pelo profesionales, deslanado y estilizado para todas las razas.' },
  { icon: Bath, title: 'Baño & SPA', desc: 'Baño completo con productos premium, hidratación profunda y aromaterapia.' },
  { icon: Stethoscope, title: 'Profilaxis Dental', desc: 'Limpieza dental ultrasónica profesional para la salud bucal de tu mascota.' },
  { icon: PawPrint, title: 'Corte de Uñas', desc: 'Servicio rápido y seguro para mantener las uñas de tu mascota en perfecto estado.' },
  { icon: Brush, title: 'Cepillado Profundo', desc: 'Eliminación de nudos y pelo muerto con tratamientos especializados.' },
  { icon: ShieldCheck, title: 'Valoración Clínica', desc: 'Revisión completa del estado de salud y piel antes de cada servicio.' },
];

const TESTIMONIALS = [
  { name: 'María González', pet: 'Rocky - Golden Retriever', text: '¡Excelente servicio! Rocky siempre sale feliz y hermoso. El equipo es muy profesional y cariñoso con las mascotas.', stars: 5 },
  { name: 'Juan Rodríguez', pet: 'Luna - Poodle Toy', text: 'El mejor SPA para mascotas de la ciudad. Luna adora ir y el corte siempre queda perfecto. ¡Muy recomendado!', stars: 5 },
  { name: 'Ana López', pet: 'Milo - Persa', text: 'La profilaxis dental dejó a Milo como nuevo. Servicio impecable y muy buen trato. Volveremos siempre.', stars: 5 },
];

const GALLERY_IMAGES = [
  { src: '/img/1.jpeg', alt: 'Promoción Mundial - Canin Duvet' },
  { src: '/img/2.jpeg', alt: 'Profilaxis Dental para Mascotas' },
  { src: '/img/3.jpeg', alt: 'Profilaxis Dental - Desde $40' },
  { src: '/img/4.jpeg', alt: 'Nuevo Producto - Pure Nature' },
];

// ─── Hook: Contador animado ─────────────────────────────
function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, shouldStart]);
  return count;
}

// ─── Hook: IntersectionObserver ─────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Detección scroll para navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToLogin = () => navigate('/login');

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="homepage">
      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className={`hp-navbar ${scrolled ? 'hp-navbar--scrolled' : ''}`}>
        <div className="hp-navbar__inner">
          <div className="hp-navbar__brand" onClick={() => scrollToSection('hero')}>
            <div className="hp-navbar__logo-icon">
              <PawPrint size={24} />
            </div>
            <div>
              <span className="hp-navbar__name">Canin Duvet</span>
              <span className="hp-navbar__sub">Clínica · SPA · Peluquería</span>
            </div>
          </div>

          <div className="hp-navbar__links">
            <button onClick={() => scrollToSection('servicios')}>Servicios</button>
            <button onClick={() => scrollToSection('galeria')}>Galería</button>
            <button onClick={() => scrollToSection('testimonios')}>Testimonios</button>
            <button onClick={() => scrollToSection('contacto')}>Contacto</button>
          </div>

          <button className="hp-navbar__login" onClick={goToLogin} id="navbar-login-btn">
            <LogIn size={18} />
            <span>Iniciar Sesión</span>
          </button>

          <button className="hp-navbar__hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="hp-mobile-menu">
            <button onClick={() => scrollToSection('servicios')}>Servicios</button>
            <button onClick={() => scrollToSection('galeria')}>Galería</button>
            <button onClick={() => scrollToSection('testimonios')}>Testimonios</button>
            <button onClick={() => scrollToSection('contacto')}>Contacto</button>
            <button className="hp-mobile-menu__login" onClick={goToLogin}>
              <LogIn size={18} /> Iniciar Sesión
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ──────────────────────────── */}
      <section id="hero" className="hp-hero">
        <div className="hp-hero__bg-shapes">
          <div className="hp-hero__shape hp-hero__shape--1" />
          <div className="hp-hero__shape hp-hero__shape--2" />
          <div className="hp-hero__shape hp-hero__shape--3" />
        </div>
        <div className="hp-hero__content">
          <div className="hp-hero__text">
            <div className="hp-hero__badge">
              <Sparkles size={16} />
              <span>El mejor cuidado para tu mascota</span>
            </div>
            <h1 className="hp-hero__title">
              Tu mascota merece el <span className="hp-hero__highlight">mejor cuidado</span> profesional
            </h1>
            <p className="hp-hero__desc">
              En <strong>Canin Duvet</strong> combinamos amor, experiencia y productos premium 
              para que tu peludito luzca y se sienta increíble. Clínica, SPA y Peluquería 
              todo en un solo lugar.
            </p>
            <div className="hp-hero__buttons">
              <button className="hp-btn hp-btn--primary" onClick={() => scrollToSection('contacto')}>
                <Phone size={18} />
                Agenda tu Cita
              </button>
              <button className="hp-btn hp-btn--outline" onClick={() => scrollToSection('servicios')}>
                Ver Servicios
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="hp-hero__visual">
            <div className="hp-hero__image-wrapper">
              <img src="/img/1.jpeg" alt="Canin Duvet - Mascota feliz" className="hp-hero__image" />
              <div className="hp-hero__floating-card hp-hero__floating-card--1">
                <Heart size={20} className="hp-hero__floating-icon" />
                <div>
                  <span className="hp-hero__floating-num">2000+</span>
                  <span className="hp-hero__floating-label">Mascotas felices</span>
                </div>
              </div>
              <div className="hp-hero__floating-card hp-hero__floating-card--2">
                <Star size={20} className="hp-hero__floating-icon" />
                <div>
                  <span className="hp-hero__floating-num">5.0</span>
                  <span className="hp-hero__floating-label">Calificación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────── */}
      <StatsSection />

      {/* ── SERVICIOS ─────────────────────────────── */}
      <section id="servicios" className="hp-section hp-services">
        <div className="hp-section__inner">
          <div className="hp-section__header">
            <span className="hp-section__label">Nuestros Servicios</span>
            <h2 className="hp-section__title">Todo lo que tu mascota necesita</h2>
            <p className="hp-section__desc">
              Ofrecemos un servicio integral de estética y salud para tu compañero peludo, 
              con los mejores profesionales y productos del mercado.
            </p>
          </div>
          <div className="hp-services__grid">
            {SERVICES.map((s, i) => (
              <div key={i} className="hp-service-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="hp-service-card__icon">
                  <s.icon size={28} />
                </div>
                <h3 className="hp-service-card__title">{s.title}</h3>
                <p className="hp-service-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERÍA / PROMOCIONES ─────────────────── */}
      <section id="galeria" className="hp-section hp-gallery">
        <div className="hp-section__inner">
          <div className="hp-section__header">
            <span className="hp-section__label">Galería & Promociones</span>
            <h2 className="hp-section__title">Descubre nuestras ofertas especiales</h2>
          </div>
          <div className="hp-gallery__carousel">
            <button
              className="hp-gallery__arrow hp-gallery__arrow--left"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="hp-gallery__track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} className="hp-gallery__slide">
                  <img src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
            <button
              className="hp-gallery__arrow hp-gallery__arrow--right"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length)}
            >
              <ChevronRight size={24} />
            </button>
            <div className="hp-gallery__dots">
              {GALLERY_IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`hp-gallery__dot ${i === currentSlide ? 'hp-gallery__dot--active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>

          {/* Grid thumbnails */}
          <div className="hp-gallery__grid">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`hp-gallery__thumb ${i === currentSlide ? 'hp-gallery__thumb--active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              >
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────── */}
      <section id="testimonios" className="hp-section hp-testimonials">
        <div className="hp-section__inner">
          <div className="hp-section__header">
            <span className="hp-section__label">Testimonios</span>
            <h2 className="hp-section__title">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="hp-testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="hp-testimonial-card">
                <div className="hp-testimonial-card__stars">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="hp-testimonial-card__text">"{t.text}"</p>
                <div className="hp-testimonial-card__author">
                  <div className="hp-testimonial-card__avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.pet}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="hp-cta">
        <div className="hp-cta__inner">
          <div className="hp-cta__content">
            <h2>¿Listo para consentir a tu mascota?</h2>
            <p>Agenda tu cita hoy y dale a tu peludito el cuidado profesional que merece.</p>
          </div>
          <div className="hp-cta__buttons">
            <a href={`https://wa.me/593984663656`} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn--whatsapp">
              <MessageCircle size={20} />
              WhatsApp
            </a>
            <a href={`tel:${BUSINESS.phone.replace(/\D/g, '')}`} className="hp-btn hp-btn--primary">
              <Phone size={20} />
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────── */}
      <section id="contacto" className="hp-section hp-contact">
        <div className="hp-section__inner">
          <div className="hp-section__header">
            <span className="hp-section__label">Contáctanos</span>
            <h2 className="hp-section__title">Estamos para servirte</h2>
          </div>
          <div className="hp-contact__grid">
            <div className="hp-contact-card">
              <div className="hp-contact-card__icon">
                <Phone size={24} />
              </div>
              <h3>Teléfono</h3>
              <p>{BUSINESS.phone}</p>
              <p>{BUSINESS.mobile}</p>
            </div>
            <div className="hp-contact-card">
              <div className="hp-contact-card__icon">
                <MapPin size={24} />
              </div>
              <h3>Ubicación</h3>
              <p>{BUSINESS.address}</p>
            </div>
            <div className="hp-contact-card">
              <div className="hp-contact-card__icon">
                <Clock size={24} />
              </div>
              <h3>Horario</h3>
              <p>{BUSINESS.hours}</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="hp-footer">
        <div className="hp-footer__inner">
          <div className="hp-footer__brand">
            <div className="hp-footer__logo">
              <PawPrint size={24} />
              <span>Canin Duvet</span>
            </div>
            <p>Clínica · SPA · Peluquería para mascotas</p>
          </div>
          <div className="hp-footer__social">
            <a href="#" aria-label="Redes Sociales"><Globe size={20} /></a>
            <a href="#" aria-label="Correo"><Mail size={20} /></a>
            <a href={`https://wa.me/593984663656`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
          <div className="hp-footer__copy">
            <p>© {new Date().getFullYear()} Canin Duvet. Todos los derechos reservados.</p>
            <button className="hp-footer__admin-link" onClick={goToLogin}>
              <LogIn size={14} />
              Acceso al Sistema
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Stats Section ──────────────────────────────────────
function StatsSection() {
  const [ref, inView] = useInView(0.3);
  const clients = useCountUp(2000, 2000, inView);
  const years = useCountUp(10, 1500, inView);
  const services = useCountUp(15000, 2500, inView);
  const rating = useCountUp(5, 1000, inView);

  return (
    <section ref={ref} className="hp-stats">
      <div className="hp-stats__inner">
        <div className="hp-stat">
          <span className="hp-stat__number">{clients}+</span>
          <span className="hp-stat__label">Clientes Felices</span>
        </div>
        <div className="hp-stat">
          <span className="hp-stat__number">{years}+</span>
          <span className="hp-stat__label">Años de Experiencia</span>
        </div>
        <div className="hp-stat">
          <span className="hp-stat__number">{services}+</span>
          <span className="hp-stat__label">Servicios Realizados</span>
        </div>
        <div className="hp-stat">
          <span className="hp-stat__number">{rating}.0</span>
          <span className="hp-stat__label">Calificación Promedio</span>
        </div>
      </div>
    </section>
  );
}
