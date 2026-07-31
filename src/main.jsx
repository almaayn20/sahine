import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { CURRENCIES, packageGroups, packages, findPackage, convertAmount, formatAmount } from './data.mjs';

const contact = {
  phone: '+97333639622',
  email: 'Info@shahin.bh',
  instagram: 'https://www.instagram.com/shahinbhcom',
  linkedin: 'https://www.linkedin.com/company/shahinest/',
};

const CurrencyContext = createContext({ currency: 'SAR', setCurrency: () => {} });
const useCurrency = () => useContext(CurrencyContext);

function CurrencySwitch() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="currency-switch" role="group" aria-label="اختيار العملة">
      {Object.values(CURRENCIES).map((item) => (
        <button
          key={item.code}
          type="button"
          className={currency === item.code ? 'active' : ''}
          onClick={() => setCurrency(item.code)}
        >
          {item.symbol}
        </button>
      ))}
    </div>
  );
}

const policyLinks = [
  { label: 'سياسة حماية بيانات المستخدم', href: '#contact' },
  { label: 'سياسة استخدام الخدمات', href: '#contact' },
  { label: 'سياسة الاستبدال والاسترجاع', href: '#contact' },
  { label: 'سياسة الشحن والتوصيل', href: '#/shipping-policy' },
];

const navItems = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'من نحن' },
  { href: '#packages', label: 'الباقات' },
  { href: '#services', label: 'الخدمات' },
  { href: '#contact', label: 'التواصل' },
];

const shippingPolicySections = [
  {
    title: 'سياسة الشحن والتوصيل للمشتري',
    items: [
      'عملية الشحن والتوصيل للمنتجات تعتبر جزءًا أساسيًا من عملية التسوق عبر شاهين. أغلب المنتجات رقمية ولا تحتاج لتوصيل، ويتم تسليمها حسب الاتفاق، ولا يحق للعميل استرداد أي مبلغ بعد الدفع لأننا نعمل على طلب العميل فور السداد.',
      'أما المنتجات المحسوسة فتقع مهمة توصيل السلع ضمن مسؤولية شركات الشحن المتعاقدة بضرورة إيصال المنتج بجودة عالية وفق معايير الدقة والسلامة اللازمة.',
      'باستخدامك لخدمات التوصيل في شاهين فأنت توافق على الشروط والتعليمات الموضحة في هذه السياسة.',
    ],
  },
  {
    title: 'تعليمات التوصيل',
    items: [
      'يجب كتابة العنوان المراد توصيل السلعة إليه بشكل دقيق، ولا نتحمل مسؤولية عدم استلام المنتج عند وجود خطأ في العنوان.',
      'في حال وجود مشكلة في عملية التوصيل يرجى التواصل مع فريق الدعم الفني لدينا.',
      'استخدامك لخدمات البريد الخاص أو الشركات المتعلقة بها يعني اتباع السياسات وشروط الاستخدام الخاصة بهم.',
    ],
  },
  {
    title: 'تكاليف الشحن والتوصيل',
    items: [
      'يرجى التأكد من تكاليف الشحن والتفاصيل الخاصة بالعملية قبل الموافقة والاعتماد.',
      'تحدد تكاليف الشحن والتوصيل حسب نوع المنتج، وجهة التسليم، وشركة الشحن المستخدمة عند وجود منتجات محسوسة.',
    ],
  },
  {
    title: 'مواعيد التوصيل',
    items: [
      'إذا تم الطلب قبل الساعة الخامسة مساءً، يتم تسليم الطلب خلال 24 إلى 72 ساعة عمل مع الأخذ بعين الاعتبار يومي الجمعة والسبت وأي عطلة رسمية تعلنها الحكومة.',
      'في بعض الحالات قد يستغرق التسليم أكثر من 72 ساعة حسب توافر المنتج في المستودعات، ويتم إخبار العميل في نفس يوم الطلب إذا كان التسليم سيستغرق وقتًا أطول.',
      'إذا تم الطلب بعد انتهاء الدوام الرسمي للشركة وهو الساعة الرابعة مساءً، يبدأ حساب فترة التوصيل من ثاني يوم عمل.',
    ],
  },
  {
    title: 'قواعد وسياسات إرجاع البضائع',
    items: [
      'لا يحق للمستخدم إرجاع المنتجات الرقمية أو الخدمات الرقمية.',
      'بالنسبة للمنتجات المحسوسة، تقبل حالات الإرجاع عند وصول المنتج تالفًا وغير صالح للاستخدام، أو عند استلام منتج مخالف للصور والمواصفات المدرجة من قبل المتجر.',
    ],
  },
  {
    title: 'منتجات غير مؤهلة للإرجاع',
    items: [
      'منتج رقمي أو خدمة رقمية.',
      'منتج يطابق المواصفات المذكورة عنه داخل الموقع وليس به أي عيب مصنعي.',
      'منتج تم استخدامه من قبل المشتري بشكل يؤدي إلى تغيير مواصفاته أو إتلافه بشكل جزئي أو كلي، أو منتج تمت إزالة الرقم التسلسلي عنه.',
      'منتج تأخر العميل في عملية إرجاعه لأكثر من 3 أيام من تاريخ التسليم.',
    ],
  },
  {
    title: 'إلغاء الطلبات',
    items: [
      'لا يحق للمستخدم طلب إلغاء أو تعديل الطلبية بعد الدفع.',
      'يحق للمستخدم إلغاء الطلبية في حالة عدم استلام المنتج خلال الفترة المحددة للشحن والتوصيل وفق المعلومات التي تظهر خلال عملية الشراء، وذلك عند وجود خلل منع دخول المنتج في عملية الشحن والتوصيل فعليًا، أو عدم وجود معلومات واضحة لتتبع حالة الشحن والتوصيل.',
      'إذا كان المستخدم قد كتب العنوان بشكل خاطئ، فإنه يتحمل مسؤولية هذا الخطأ.',
      'يحق للمستخدم إلغاء أي طلب قام بدفعه مسبقًا ولا يتم إرجاع أي جزء من المبلغ للعميل، ولا تتحمل شاهين العمولات المترتبة على ذلك، ويتم دراسة حالته خلال 45 يوم عمل.',
    ],
  },
];

const marketingServices = [
  {
    icon: 'content',
    title: 'استراتيجية المحتوى والخطط الشهرية',
    text: 'خطط محتوى وجداول نشر مبنية على أهداف واضحة، من فكرة المنشور إلى موعد نشره.',
  },
  {
    icon: 'share',
    title: 'إدارة منصات التواصل الاجتماعي',
    text: 'إدارة يومية لحساباتك، نشر منتظم، ومتابعة تفاعل تبني حضورًا يدوم.',
  },
  {
    icon: 'trending',
    title: 'الحملات الترويجية والإعلانات',
    text: 'إطلاق وإدارة حملات ممولة تصل لجمهورك الصح وتزيد طلباتك.',
  },
  {
    icon: 'spark',
    title: 'الإنتاج المرئي والتصوير',
    text: 'تصاميم وفيديوهات وجلسات تصوير دورية تعكس مستوى علامتك.',
  },
  {
    icon: 'ai',
    title: 'تحليلات وتقارير أداء بالذكاء الاصطناعي',
    text: 'قياس مستمر للنتائج وتقارير دورية توضح لك وين تنمو.',
  },
];

const techServices = [
  {
    icon: 'code',
    title: 'بناء المواقع والصفحات الرقمية',
    text: 'صفحات ومواقع سريعة، مربوطة بواتساب والبريد وأدوات التحليل.',
  },
  {
    icon: 'store',
    title: 'الحلول التقنية المخصصة',
    text: 'أنظمة وتطبيقات مصممة على مقاس عملياتك، من الفكرة إلى الإطلاق.',
  },
  {
    icon: 'automation',
    title: 'أتمتة العمليات وإدارة الطلبات',
    text: 'ربط أنظمتك ببعض عشان تقل الأعمال اليدوية وتنتظم طلباتك.',
  },
  {
    icon: 'ai',
    title: 'مساعدات وحلول الذكاء الاصطناعي',
    text: 'ردود ذكية ومساعد افتراضي يخدم عملاءك على مدار الساعة.',
  },
  {
    icon: 'shield',
    title: 'الحماية والدعم الفني المستمر',
    text: 'نسخ احتياطي، حماية بياناتك، ودعم فني يبقى معاك بعد الإطلاق.',
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
    check: (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8 12.3l2.6 2.6L16.5 9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2.2" />
        <path d="M3 10.5h18" />
        <path d="M7 15h4" />
      </>
    ),
    spinner: (
      <path d="M12 3a9 9 0 1 0 9 9" />
    ),
  };

  return (
    <svg className={`icon icon-${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg className="apple-pay-icon" viewBox="0 0 72 30" aria-hidden="true">
      <path
        className="apple-pay-apple"
        d="M17.3 8.7c-.9 1.1-2.3 2-3.7 1.9-.2-1.5.5-3 1.4-4 1-1.2 2.6-2 3.9-2.1.2 1.5-.5 3-1.6 4.2Zm1.5 2.2c-2-.1-3.7 1.1-4.6 1.1-1 0-2.4-1-4-1-2.1 0-4.1 1.2-5.2 3.1-2.2 3.8-.6 9.4 1.6 12.5 1.1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4-1s2.3 1 4 1c1.7 0 2.8-1.5 3.8-3 1.2-1.7 1.7-3.4 1.7-3.5 0-.1-3.3-1.3-3.3-5 0-3.1 2.5-4.6 2.6-4.7-1.4-2.1-3.6-2.5-4.6-2.6Z"
      />
      <path
        className="apple-pay-word"
        d="M34.3 9.2c2.7 0 4.6 1.8 4.6 4.5s-1.9 4.5-4.7 4.5h-3v5.1h-2.4V9.2h5.5Zm-3.1 7h2.5c1.8 0 2.8-.9 2.8-2.5s-1-2.5-2.8-2.5h-2.5v5Zm8.7 4.2c0-1.8 1.4-2.9 3.9-3.1l2.7-.2v-.8c0-1.1-.7-1.7-2-1.7-1.1 0-1.9.5-2.1 1.3h-2.2c.1-1.9 1.9-3.3 4.4-3.3 2.6 0 4.2 1.4 4.2 3.6v7.1h-2.2v-1.6h-.1c-.6 1.1-1.9 1.8-3.2 1.8-2 0-3.4-1.2-3.4-3.1Zm6.6-.9v-.8l-2.4.2c-1.3.1-2 .6-2 1.5s.8 1.4 1.8 1.4c1.5 0 2.6-1 2.6-2.3Zm5.2 7.6v-1.9c.2.1.6.1.9.1 1.2 0 1.8-.5 2.2-1.8l.2-.6-3.8-10.1h2.5l2.6 8.1h.1l2.6-8.1h2.4l-3.9 10.8c-.9 2.6-2.1 3.6-4.5 3.6-.4 0-1-.1-1.3-.1Z"
      />
    </svg>
  );
}

function PriceTag({ price }) {
  const { currency } = useCurrency();
  return (
    <strong className="price-tag">
      <span className="price-number">{formatAmount(price, currency)}</span>
      <span className="price-currency">{CURRENCIES[currency].label}</span>
    </strong>
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
      <span className="pattern-layer" aria-hidden="true" />
      <div className="hero-vignette" />
      <div className="hero-copy">
        <span className="hero-eyebrow">شاهين للتقنية والتسويق الرقمي</span>
        <h1>
          نصنع <span>المستقبل الرقمي</span>
        </h1>
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
          <p>بالتعاون مع بنك التنمية وبرنامج تجسير — باقات واضحة تسويقية وتقنية تختارها حسب مرحلة مشروعك.</p>
          <CurrencySwitch />
        </div>

        {packageGroups.map((group) => (
          <div className={`package-group ${group.key}`} key={group.key}>
            <div className="package-group-header">
              <span className="package-group-index">{group.index}</span>
              <div className="package-group-heading">
                <h3>{group.title}</h3>
                <p>{group.text}</p>
              </div>
            </div>
            <div className="package-grid">
              {group.items.map((item) => (
                <a
                  className={`package-card ${group.tone} ${item.featured ? 'featured' : ''}`}
                  href={`#/checkout?package=${item.id}`}
                  key={item.id}
                >
                  {item.featured && <span className="package-featured-tag">الأكثر طلبًا</span>}
                  <span className="package-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <div className="package-price">
                    <span>{item.priceLabel}</span>
                    <PriceTag price={item.price} />
                  </div>
                  <p>{item.audience}</p>
                  <ul>
                    {item.features.map((feature) => (
                      <li key={feature}>
                        <Icon name="check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {item.note && <p className="package-note">{item.note}</p>}
                  <span className="package-cta">الانتقال للدفع</span>
                </a>
              ))}
            </div>
          </div>
        ))}
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
          <h2>شريكك الرقمي من الفكرة إلى النتيجة</h2>
          <p>
            إحنا شاهين. نجمع التسويق والتقنية والذكاء الاصطناعي في مكان واحد، عشان ما تحتاج أكثر
            من شريك لنمو مشروعك. نصمم لك محتوى يوصل، نبني لك موقع أو متجر يشتغل صح، ونؤتمت
            عملياتك عشان توفر وقتك وتركّز على اللي يهمك. شغلنا يبدأ من فهم مشروعك، ويوصل لنتائج
            تشوفها بعينك.
          </p>
          <div className="metrics">
            <div className="metric">
              <strong>30</strong>
              <span>مشروع رقمي</span>
            </div>
            <div className="metric">
              <strong>98%</strong>
              <span>رضا العملاء</span>
            </div>
          </div>
        </div>
        <div className="logo-stage">
          <span className="pattern-layer" aria-hidden="true" />
          <img src="/LOGO.svg" alt="Shahin company logo" />
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
          <div className="service-group-header">
            <span className="service-group-index">01</span>
            <h3>خدمات التسويق</h3>
          </div>
          <div className="cards-grid">
            {marketingServices.map((service) => (
              <ServiceCard key={service.title} service={service} tone="secondary" />
            ))}
          </div>
        </div>

        <div className="service-group tech">
          <div className="service-group-header">
            <span className="service-group-index">02</span>
            <h3>الخدمات التقنية</h3>
          </div>
          <div className="cards-grid">
            {techServices.map((service) => (
              <ServiceCard key={service.title} service={service} tone="" />
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
      <span className="pattern-layer dark" aria-hidden="true" />
      <h2>هل أنت مستعد لإحداث فرق رقمي؟</h2>
      <a href={`https://wa.me/${contact.phone.replace('+', '')}`}>ابدأ مشروعك اليوم</a>
    </section>
  );
}

const paymentLogos = [
  { name: 'Visa', src: '/payments/visa.png' },
  { name: 'Mastercard', src: '/payments/mastercard.svg' },
  { name: 'mada', src: '/payments/mada.webp' },
  { name: 'GCC Net', src: '/payments/gccnet.png' },
  { name: 'Apple Pay', src: '/payments/apple-pay.jpg' },
  { name: 'Google Pay', src: '/payments/google-pay.png' },
  { name: 'Samsung Pay', src: '/payments/samsung-pay.svg' },
  { name: 'BenefitPay', src: '/payments/benefit-pay.png', square: true },
];

function PaymentBadges() {
  return (
    <div className="payment-badges" aria-label="طرق الدفع المتاحة">
      {paymentLogos.map((logo) => (
        <span className={`payment-badge ${logo.square ? 'square' : ''}`} key={logo.name}>
          <img src={logo.src} alt={logo.name} loading="lazy" />
        </span>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <span className="pattern-layer" aria-hidden="true" />
      <div className="footer-brand">
        <img src="/LOGO.svg" alt="Shahin" />
        <p>Shahin company w.l.l</p>
      </div>
      <div className="footer-column">
        <h3>سياسات العمل</h3>
        <div className="footer-links">
          {policyLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
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
      <div className="footer-payments">
        <span>طرق الدفع المتاحة</span>
        <PaymentBadges />
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

const PHONE_COUNTRIES = [
  { code: '+973', label: 'البحرين +973' },
  { code: '+966', label: 'السعودية +966' },
];

function CheckoutPage({ packageId }) {
  const { currency } = useCurrency();
  const selectedPackage = findPackage(packageId) || packages[0];
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneCode: currency === 'SAR' ? '+966' : '+973',
    phoneLocal: '',
    notes: '',
  });
  const [status, setStatus] = useState({ loading: null, error: '' });

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // If the payment redirect leaves the SPA and the visitor comes back with
  // the browser's back button, the page can be restored from bfcache frozen
  // mid-request — the button would stay stuck on its spinner forever.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setStatus((prev) =>
          prev.loading ? { loading: null, error: 'ما اكتمل الدفع. جرّب مرة ثانية.' } : prev,
        );
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const startPayment = async (method) => {
    const phone = form.phoneLocal ? `${form.phoneCode}${form.phoneLocal.replace(/\D/g, '')}` : '';
    if (!form.name || (!form.email && !phone)) {
      setStatus({ loading: null, error: 'عبّي الاسم، وبريدك الإلكتروني أو رقم جوالك، عشان نكمل الدفع.' });
      return;
    }

    setStatus({ loading: method, error: '' });
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          currency,
          method,
          client: { name: form.name, email: form.email, phone },
          notes: form.notes,
        }),
      });

      const raw = await response.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!data) {
        throw new Error('سيرفر الدفع مو شغّال حاليًا. لازم تشغّل الباكند (serve.mjs) جنب الموقع.');
      }
      if (!response.ok || !data.checkout_url) {
        throw new Error(data.error || 'تعذر إنشاء عملية الدفع.');
      }
      window.location.href = data.checkout_url;
    } catch (error) {
      setStatus({ loading: null, error: error.message || 'صار خطأ غير متوقع، حاول مرة ثانية.' });
    }
  };

  return (
    <>
      <Header />
      <main className="page-main checkout-page">
        <section className="checkout-hero">
          <span className="eyebrow">Checkout</span>
          <h1>إتمام شراء {selectedPackage.title}</h1>
          <p>راجع تفاصيل الباقة، عبّي بياناتك، واختر طريقة الدفع المناسبة لك.</p>
          <CurrencySwitch />
        </section>
        <section className="checkout-grid">
          <form className="checkout-form" onSubmit={(event) => event.preventDefault()}>
            <h2>بيانات العميل</h2>
            <label>
              الاسم الكامل
              <input type="text" placeholder="اكتب اسمك" value={form.name} onChange={updateField('name')} />
            </label>
            <label>
              البريد الإلكتروني
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={updateField('email')}
              />
            </label>
            <label>
              رقم الجوال
              <div className="phone-field">
                <select value={form.phoneCode} onChange={updateField('phoneCode')} aria-label="رمز الدولة">
                  {PHONE_COUNTRIES.map((country) => (
                    <option value={country.code} key={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="3xxxxxxx"
                  value={form.phoneLocal}
                  onChange={updateField('phoneLocal')}
                />
              </div>
            </label>
            <label>
              ملاحظات المشروع
              <textarea
                placeholder="اكتب أي تفاصيل مهمة عن مشروعك"
                rows="5"
                value={form.notes}
                onChange={updateField('notes')}
              />
            </label>

            {status.error && <p className="checkout-error">{status.error}</p>}

            <div className="payment-methods">
              <button
                className="apple-pay-button"
                type="button"
                aria-label="الدفع عبر Apple Pay"
                disabled={Boolean(status.loading)}
                onClick={() => startPayment('apple_pay')}
              >
                {status.loading === 'apple_pay' ? <Icon name="spinner" /> : <ApplePayIcon />}
              </button>
              <button
                className="card-pay-button"
                type="button"
                disabled={Boolean(status.loading)}
                onClick={() => startPayment('card')}
              >
                {status.loading === 'card' ? <Icon name="spinner" /> : <Icon name="card" />}
                الدفع بالبطاقة
              </button>
            </div>
            <p className="payment-note">الدفع يتم عبر بوابة فاتورة الآمنة — ما نخزن بيانات بطاقتك عندنا.</p>
          </form>
          <aside className={`checkout-summary ${selectedPackage.tone}`}>
            <span>{selectedPackage.label}</span>
            <h2>{selectedPackage.title}</h2>
            <p>{selectedPackage.audience}</p>
            <ul>
              {selectedPackage.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="summary-total">
              <span>الإجمالي</span>
              <PriceTag price={selectedPackage.price} />
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PaymentResultPage({ status: routeStatus, orderId }) {
  const [result, setResult] = useState({ state: 'checking' });

  useEffect(() => {
    if (!orderId) {
      setResult({ state: routeStatus === 'success' ? 'unknown' : 'failed' });
      return;
    }
    let cancelled = false;
    fetch(`/api/verify?order_id=${encodeURIComponent(orderId)}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (data.payment_status === 'SUCCESS') {
          setResult({ state: 'success', data });
        } else if (data.payment_status === 'PENDING') {
          setResult({ state: 'pending', data });
        } else {
          setResult({ state: 'failed', data });
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ state: 'unknown' });
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, routeStatus]);

  const copy = {
    checking: { title: 'لحظات، نتحقق من عملية الدفع...', text: 'ما تسكر الصفحة.' },
    success: { title: 'تم الدفع بنجاح 🎉', text: 'وصلنا طلبك وبنتواصل معك قريبًا لبدء العمل.' },
    pending: { title: 'الدفع قيد المعالجة', text: 'بنأكد لك فور اكتمال العملية عبر البريد أو الجوال.' },
    failed: { title: 'ما اكتملت عملية الدفع', text: 'ممكن تحاول مرة ثانية أو تتواصل معنا مباشرة.' },
    unknown: { title: 'ما قدرنا نتأكد من حالة الدفع', text: 'تواصل معنا وبنتأكد لك من حالة طلبك.' },
  }[result.state];

  return (
    <>
      <Header />
      <main className="page-main">
        <section className="checkout-hero payment-result">
          <span className={`eyebrow ${result.state}`}>Checkout</span>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#home">
              الرجوع للرئيسية
            </a>
            <a className="glass-button" href={`https://wa.me/${contact.phone.replace('+', '')}`}>
              تواصل معنا
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="page-main policy-page">
        <section className="policy-hero">
          <span className="eyebrow">سياسات العمل</span>
          <h1>سياسة الشحن والتوصيل</h1>
          <p>توضح هذه السياسة آلية تسليم المنتجات الرقمية والمحسوسة، وشروط الإرجاع والإلغاء الخاصة بخدمات شاهين.</p>
        </section>
        <section className="policy-content">
          {shippingPolicySections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const getRoute = () => {
    const hash = window.location.hash || '';
    const hashValue = hash.startsWith('#') ? hash.slice(1) : hash;
    const [hashPath, hashQuery = ''] = hashValue.split('?');

    if (hashPath === '/checkout') {
      const params = new URLSearchParams(hashQuery);
      return { name: 'checkout', packageId: params.get('package') };
    }

    if (hashPath === '/shipping-policy') {
      return { name: 'shipping-policy' };
    }

    if (hashPath === '/payment-success' || hashPath === '/payment-failure') {
      const params = new URLSearchParams(hashQuery);
      return {
        name: 'payment-result',
        status: hashPath === '/payment-success' ? 'success' : 'failure',
        orderId: params.get('order_id'),
      };
    }

    if (window.location.pathname === '/checkout') {
      const params = new URLSearchParams(window.location.search);
      return { name: 'checkout', packageId: params.get('package') };
    }

    if (window.location.pathname === '/shipping-policy') {
      return { name: 'shipping-policy' };
    }

    return { name: 'home' };
  };

  const [route, setRoute] = useState(() => getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [route.name, route.packageId]);

  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('shahin_currency') || 'SAR';
    } catch {
      return 'SAR';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shahin_currency', currency);
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, [currency]);

  let page = (
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

  if (route.name === 'checkout') {
    page = <CheckoutPage packageId={route.packageId} />;
  } else if (route.name === 'shipping-policy') {
    page = <ShippingPolicyPage />;
  } else if (route.name === 'payment-result') {
    page = <PaymentResultPage status={route.status} orderId={route.orderId} />;
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{page}</CurrencyContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App />);
