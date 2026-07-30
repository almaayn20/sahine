// Shared data + pricing logic — plain ESM so it can be imported by both the
// browser bundle (main.jsx) and the Node server (serve.mjs) as a single
// source of truth. Never trust a client-supplied price; always look it up
// here on the server before charging.

export const CURRENCIES = {
  SAR: { code: 'SAR', label: 'ريال سعودي', symbol: 'ر.س', decimals: 0 },
  BHD: { code: 'BHD', label: 'دينار بحريني', symbol: 'د.ب', decimals: 3 },
};

// Both riyal and dinar are USD-pegged at a fixed rate (SAR 3.75, BHD 0.376
// per USD), so this ratio is effectively constant — not a floating-market
// conversion.
const SAR_PER_BHD = 3.75 / 0.376;

export function convertAmount(amountInSar, currency) {
  if (currency === 'BHD') {
    return Number((amountInSar / SAR_PER_BHD).toFixed(3));
  }
  return amountInSar;
}

export function formatAmount(amountInSar, currency) {
  const converted = convertAmount(amountInSar, currency);
  const decimals = CURRENCIES[currency]?.decimals ?? 0;
  return converted.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export const packageGroups = [
  {
    key: 'marketing',
    index: '01',
    tone: 'secondary',
    title: 'باقات التسويق الرقمي',
    text: 'إدارة احترافية لحضورك على منصات التواصل — محتوى، إنتاج، وحملات تحقّق انتشارًا وتفاعلًا حقيقيًا.',
    items: [
      {
        id: 'launch',
        title: 'باقة الانطلاقة',
        label: 'Marketing',
        price: 1998,
        priceLabel: 'قيمة الباقة شهريًا',
        audience: 'المشاريع الجديدة والمنشآت الصغيرة التي ترغب في تأسيس حضور رقمي احترافي.',
        features: [
          'إدارة منصة تواصل اجتماعي واحدة',
          'خطة محتوى شهرية و12 منشورًا',
          'إنتاج 4 فيديوهات قصيرة بالذكاء الاصطناعي',
          'تحسين الحساب وجدولة المحتوى',
          'تقرير أداء شهري',
        ],
      },
      {
        id: 'growth',
        title: 'باقة النمو',
        label: 'Marketing',
        price: 4198,
        priceLabel: 'قيمة الباقة شهريًا',
        audience: 'المنشآت التي ترغب في زيادة الانتشار والتفاعل والطلبات.',
        features: [
          'إدارة وإطلاق حملة ترويجية على منصة سناب شات',
          '5 تصاميم و2 فيديوهات',
          'جلسة تصوير شهرية',
          'إدارة التفاعل وتقرير تحليلي',
        ],
        note: 'ميزانية الإعلانات غير مشمولة',
      },
      {
        id: 'leadership',
        title: 'باقة الريادة',
        label: 'Marketing',
        price: 7998,
        priceLabel: 'قيمة الباقة شهريًا',
        audience: 'العلامات التجارية والمنشآت التي تبحث عن إدارة تسويقية متكاملة ونمو مستمر.',
        features: [
          'إدارة منصتين للتواصل الاجتماعي',
          'إعداد استراتيجية تسويق ونمو',
          'إنتاج محتوى وجلسات تصوير دورية',
          'إدارة الحملات التسويقية والإعلانية',
          'إدارة المجتمع والتقارير والاجتماع الشهري',
        ],
        note: 'ميزانية الإعلانات والإنتاج الخارجي غير مشمولة',
        featured: true,
      },
    ],
  },
  {
    key: 'tech',
    index: '02',
    tone: '',
    title: 'باقات الحلول التقنية',
    text: 'بنية رقمية وأتمتة وذكاء اصطناعي تنظّم عملياتك وترفع كفاءتك — من التأسيس إلى التحول الكامل.',
    items: [
      {
        id: 'foundation',
        title: 'باقة التأسيس الرقمي',
        label: 'Tech',
        price: 2998,
        priceLabel: 'قيمة الباقة لمرة واحدة',
        audience: 'المشاريع الجديدة والمنشآت التي تبدأ رحلتها في التحول الرقمي.',
        features: [
          'تحليل الاحتياج وتجهيز البيئة الرقمية',
          'إنشاء صفحة إلكترونية ونموذج تواصل',
          'ربط واتساب والبريد وأدوات التحليل',
          'إعداد ردود وحلول ذكاء اصطناعي أساسية',
          'الحماية والنسخ الاحتياطي والدعم الفني',
        ],
      },
      {
        id: 'automation',
        title: 'باقة الأتمتة والنمو',
        label: 'Tech',
        price: 4998,
        priceLabel: 'قيمة الباقة لمرة واحدة',
        audience: 'المنشآت التي تعاني من تشتت الطلبات وكثرة العمل اليدوي.',
        features: [
          'تحليل رحلة العميل والعمليات',
          'تنظيم إدارة العملاء والطلبات',
          'أتمتة المهام وربط الأنظمة',
          'إعداد التنبيهات ولوحات المؤشرات',
          'مساعد ذكي وتدريب ودعم فني',
        ],
      },
      {
        id: 'transformation',
        title: 'باقة التحول الذكي',
        label: 'Tech',
        price: 9998,
        priceLabel: 'تبدأ من (لمرة واحدة)',
        audience: 'المنشآت التي تستهدف تحولًا رقميًا شاملًا وتوسعًا أكثر كفاءة.',
        features: [
          'دراسة شاملة للاحتياجات التقنية',
          'تصميم وتطوير أنظمة مخصصة',
          'أتمتة متقدمة وحلول ذكاء اصطناعي',
          'لوحات تحكم وحماية وإدارة صلاحيات',
          'تدريب وتطوير ودعم مستمر',
        ],
        featured: true,
      },
    ],
  },
];

export const packages = packageGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, tone: group.tone })),
);

export function findPackage(packageId) {
  return packages.find((item) => item.id === packageId) || null;
}
