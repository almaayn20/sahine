import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const contact = {
  phone: '+97333639622',
  email: 'Info@shahin.bh',
  instagram: 'https://www.instagram.com/shahinbhcom',
  linkedin: 'https://www.linkedin.com/company/shahinest/',
};

const policyLinks = [
  'سياسة حماية بيانات المستخدم',
  'سياسة استخدام الخدمات',
  'سياسة الاستبدال والاسترجاع',
];

const navItems = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'من نحن' },
  { href: '#packages', label: 'الباقات' },
  { href: '#services', label: 'الخدمات' },
  { href: '#contact', label: 'التواصل' },
];

const packages = [
  {
    title: 'باقة النمو التسويقي',
    label: 'Marketing',
    tone: 'purple',
    text: 'إدارة تسويق متكاملة تجمع المحتوى، التصميم، الإعلانات، الذكاء الاصطناعي، وأتمتة المتابعة لرفع جودة الحضور الرقمي.',
    features: ['هوية بصرية وتصاميم حملات', 'محتوى وسوشيال ميديا', 'إعلانات وتحسين ظهور', 'AI لتحليل الرسائل والجمهور', 'أتمتة الردود والمتابعة'],
  },
  {
    title: 'باقة التقنية والأتمتة',
    label: 'Tech + AI',
    tone: 'blue',
    text: 'حلول برمجية للمتاجر والمواقع والتطبيقات مع دمج أدوات AI وأتمتة العمليات لتقليل العمل اليدوي وتسريع النمو.',
    features: ['مواقع ومتاجر وتطبيقات', 'لوحات تحكم وتكاملات', 'أتمتة عمليات البيع والعملاء', 'مساعدات AI داخل الأنظمة', 'تحليلات وتتبع أداء'],
  },
];

const marketingServices = [
  {
    icon: 'content',
    title: 'استراتيجية المحتوى',
    text: 'خطط محتوى تسويقي تعبر عن هوية علامتك وتحوّل الاهتمام إلى تفاعل واضح.',
  },
  {
    icon: 'share',
    title: 'إدارة التواصل الاجتماعي',
    text: 'نشر وجدولة وتحسين حضورك اليومي مع متابعة الأداء وتطوير الرسائل.',
  },
  {
    icon: 'trending',
    title: 'تحسين محركات البحث (SEO)',
    text: 'تهيئة المحتوى والصفحات لزيادة الظهور والوصول إلى العملاء المهتمين.',
  },
  {
    icon: 'spark',
    title: 'التصميم للحملات والهوية',
    text: 'تصاميم سوشيال ميديا وإعلانات وهوية بصرية تمنح العلامة حضورًا فاخرًا ومتسقًا.',
  },
  {
    icon: 'ai',
    title: 'AI وأتمتة التسويق',
    text: 'تحليل الرسائل والجمهور، تحسين الأفكار، وتجهيز ردود ومسارات متابعة تلقائية.',
  },
];

const techServices = [
  {
    icon: 'mobile',
    title: 'تطوير التطبيقات',
    text: 'تصميم وتطوير تطبيقات رقمية مرنة، سريعة، وقابلة للنمو حسب احتياج المشروع.',
  },
  {
    icon: 'store',
    title: 'حلول التجارة الإلكترونية',
    text: 'بناء وإدارة متاجر رقمية تعرض المنتجات وتدعم عمليات البيع بكفاءة.',
  },
  {
    icon: 'code',
    title: 'تطوير المواقع',
    text: 'مواقع تفاعلية عصرية ومتوافقة مع مختلف الأجهزة لتعزيز حضورك الرقمي.',
  },
  {
    icon: 'ai',
    title: 'حلول الذكاء الاصطناعي',
    text: 'مساعدات ذكية، تلخيص بيانات، توصيات، وربط AI داخل أنظمة الشركة ومواقعها.',
  },
  {
    icon: 'automation',
    title: 'أتمتة العمليات',
    text: 'ربط النماذج، العملاء، الإشعارات، التقارير، والمدفوعات لتقليل العمل اليدوي.',
  },
];

function Icon({ name }) {
  const icons = {
    content: (
      <>
        <path d="M5 6h14" />
        <path d="M5 12h10" />
        <path d="M5 18h7" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.6 6.8-4.2" />
        <path d="m8.6 13.4 6.8 4.2" />
      </>
    ),
    trending: (
      <>
        <path d="m4 16 6-6 4 4 6-8" />
        <path d="M15 6h5v5" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8L12 3Z" />
        <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />
      </>
    ),
    ai: (
      <>
        <path d="M8 5v14" />
        <path d="M16 5v14" />
        <path d="M6 9h4" />
        <path d="M14 9h4" />
        <path d="M6 15h4" />
        <path d="M14 15h4" />
        <path d="M10 3h4" />
        <path d="M10 21h4" />
      </>
    ),
    mobile: (
      <>
        <rect x="8" y="3" width="8" height="18" rx="2" />
        <path d="M11 17h2" />
      </>
    ),
    store: (
      <>
        <path d="M4 10h16" />
        <path d="M5 10l1-6h12l1 6" />
        <path d="M6 10v10h12V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    code: (
      <>
        <path d="m9 7-5 5 5 5" />
        <path d="m15 7 5 5-5 5" />
      </>
    ),
    automation: (
      <>
        <path d="M4 12a8 8 0 0 1 13.7-5.6" />
        <path d="M18 3v5h-5" />
        <path d="M20 12a8 8 0 0 1-13.7 5.6" />
        <path d="M6 21v-5h5" />
      </>
    ),
    phone: (
      <path d="M6.6 4.8 8.8 4l2.5 5-1.7 1.3a12 12 0 0 0 4.1 4.1l1.3-1.7 5 2.5-.8 2.2c-.3.8-1 1.3-1.9 1.2C10.2 18.1 5.9 13.8 5.4 6.7c-.1-.9.4-1.6 1.2-1.9Z" />
    ),
    mail: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </>
    ),
    instagram: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3" />
        <path d="M16.5 7.5h.01" />
      </>
    ),
    linkedin: (
      <>
        <path d="M6 10v8" />
        <path d="M6 6v.01" />
        <path d="M10 18v-8" />
        <path d="M10 13a3 3 0 0 1 6 0v5" />
      </>
    ),
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
      <a href="#home" className="brand" aria-label="Shahin">
        <img src="/LOGO.svg" alt="Shahin" />
      </a>
      <button
        type="button"
        className="menu-toggle"
        aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        aria-expanded={isMenuOpen}
        aria-controls="main-nav"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        ☰
      </button>
      <nav id="main-nav" aria-label="التنقل الرئيسي">
        {navItems.map((item) => (
          <a
            href={item.href}
            title={item.label}
            aria-label={item.label}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a className="pill-action" href={`mailto:${contact.email}`} title="ابدأ الآن" aria-label="ابدأ الآن">
        ابدأ
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <video className="hero-video" src="/hero-header.mp4" autoPlay muted loop playsInline />
      <div className="hero-fallback" aria-hidden="true" />
      <div className="hero-vignette" />
      <div className="hero-copy">
        <h1>نصنع المستقبل الرقمي</h1>
        <p>حلول متكاملة في التقنية ودمج الذكاء الاصطناعي في التجارة والتسويق الرقمي.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#contact">
            ابدأ الآن
          </a>
          <a className="glass-button" href="#services">
            اكتشف المزيد
          </a>
        </div>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section className="packages-section" id="packages">
      <div className="section-inner">
        <div className="center-heading">
          <h2>باقات الخدمات</h2>
          <p>باقتان واضحتان يمكن تخصيصهما حسب مرحلة مشروعك: تسويق فاخر قابل للقياس، وتقنية ذكية مؤتمتة.</p>
        </div>
        <div className="package-grid">
          {packages.map((item) => (
            <article className={`package-card ${item.tone}`} key={item.title}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul>
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a href="#contact">اطلب الباقة</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <div className="section-inner about-grid">
        <div className="about-copy">
          <span className="eyebrow">من نحن</span>
          <h2>نوظف الذكاء الإصطناعي بالتقنية والتسويق والتجارة</h2>
          <p>
            شاهين شركة سعودية تقدم حلولًا متكاملة في التقنية، دمج الذكاء الاصطناعي، التجارة
            الإلكترونية، والتسويق الرقمي. نساعد العلامات على بناء أنظمة أذكى وحضور أقوى وتجارب
            رقمية قابلة للنمو.
          </p>
          <div className="metrics">
            <strong>
              30
              <span>مشروع رقمي</span>
            </strong>
            <strong>
              98%
              <span>رضا العملاء</span>
            </strong>
          </div>
        </div>
        <div className="logo-stage">
          <div className="logo-glass">
            <img src="/LOGO.svg" alt="Shahin company logo" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, tone }) {
  return (
    <article className={`service-card ${tone}`}>
      <span className="service-icon">
        <Icon name={service.icon} />
      </span>
      <h4>{service.title}</h4>
      <p>{service.text}</p>
      <a href="#contact">اكتشف المزيد</a>
    </article>
  );
}

function Services() {
  return (
    <section className="services-section" id="services">
      <div className="section-inner">
        <div className="center-heading">
          <h2>خدماتنا المتخصصة</h2>
          <p>نقدم مجموعة شاملة من الحلول المصممة خصيصًا لارتقاء أعمالك في الفضاء الرقمي.</p>
        </div>

        <div className="service-group marketing">
          <h3>خدمات التسويق</h3>
          <div className="cards-grid">
            {marketingServices.map((service) => (
              <ServiceCard key={service.title} service={service} tone="purple" />
            ))}
          </div>
        </div>

        <div className="service-group tech">
          <h3>الخدمات التقنية</h3>
          <div className="cards-grid">
            {techServices.map((service) => (
              <ServiceCard key={service.title} service={service} tone="blue" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="cta-section">
      <h2>هل أنت مستعد لإحداث فرق رقمي؟</h2>
      <a href={`https://wa.me/${contact.phone.replace('+', '')}`}>ابدأ مشروعك اليوم</a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-brand">
        <img src="/LOGO.svg" alt="Shahin" />
        <p>Shahin company w.l.l</p>
      </div>
      <div className="footer-column">
        <h3>سياسات العمل</h3>
        <div className="footer-links">
          {policyLinks.map((link) => (
            <a href="#contact" key={link}>
              {link}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-column">
        <h3>معلومات التواصل</h3>
        <div className="footer-links">
          <a href={`tel:${contact.phone}`}>
            <Icon name="phone" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`}>
            <Icon name="mail" />
            {contact.email}
          </a>
          <a href={contact.instagram} target="_blank" rel="noreferrer">
            <Icon name="instagram" />
            Instagram
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">
            <Icon name="linkedin" />
            LinkedIn
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Shahin company w.l.l جميع الحقوق محفوظة</p>
        <div className="socials">
          <a href={contact.instagram} target="_blank" rel="noreferrer">
            IG
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">
            IN
          </a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Packages />
        <Services />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
