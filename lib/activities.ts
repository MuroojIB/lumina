export type CategoryId = 'sports' | 'arts' | 'learning' | 'games' | 'adventure' | 'social'

export type Category = {
  id: CategoryId
  label: string
  image: string
  bg: string
  description: string
}

export const CATEGORIES: Category[] = [
  { id: 'sports', label: 'رياضة', image: '/images/cat-sports.png', bg: 'bg-cat-sports', description: 'جري، بادل، كرة، ودراجات' },
  { id: 'arts', label: 'فن وثقافة', image: '/images/cat-arts.png', bg: 'bg-cat-arts', description: 'ورش رسم، متاحف، ومعارض' },
  { id: 'learning', label: 'تعليم وتعلم', image: '/images/cat-learning.png', bg: 'bg-cat-learning', description: 'أندية قراءة وورش مهارات' },
  { id: 'games', label: 'ألعاب وترفيه', image: '/images/cat-games.png', bg: 'bg-cat-games', description: 'ألعاب لوحية وليالي مرح' },
  { id: 'adventure', label: 'مغامرات', image: '/images/cat-adventure.png', bg: 'bg-cat-adventure', description: 'هايكنج، تخييم، واستكشاف' },
  { id: 'social', label: 'أنشطة اجتماعية', image: '/images/cat-social.png', bg: 'bg-cat-social', description: 'قهوة، تعارف، ولقاءات' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>

export type Person = {
  id: string
  name: string
  bio: string
  tone: CategoryId
}

export const CURRENT_USER_ID = 'me'

export const PEOPLE: Record<string, Person> = {
  me: { id: 'me', name: 'سارة العتيبي', bio: 'محبة للرسم والقهوة واللقاءات الصغيرة', tone: 'arts' },
  khalid: { id: 'khalid', name: 'خالد الحربي', bio: 'عدّاء صباحي ومدرب لياقة هاوٍ', tone: 'sports' },
  noura: { id: 'noura', name: 'نورة القحطاني', bio: 'قارئة نهمة ومؤسسة نادي «سطور»', tone: 'learning' },
  faisal: { id: 'faisal', name: 'فيصل الدوسري', bio: 'جامع ألعاب لوحية منذ ٢٠١٥', tone: 'games' },
  omar: { id: 'omar', name: 'عمر الشهري', bio: 'دليل رحلات برية معتمد', tone: 'adventure' },
  reem: { id: 'reem', name: 'ريم الزهراني', bio: 'لاعبة بادل ومحبة للتحدي', tone: 'sports' },
  hind: { id: 'hind', name: 'هند المطيري', bio: 'مصورة مستقلة وصانعة محتوى', tone: 'learning' },
  layan: { id: 'layan', name: 'ليان السبيعي', bio: '', tone: 'social' },
  yousef: { id: 'yousef', name: 'يوسف العمري', bio: '', tone: 'games' },
  maha: { id: 'maha', name: 'مها الغامدي', bio: '', tone: 'arts' },
  abdullah: { id: 'abdullah', name: 'عبدالله الرشيد', bio: '', tone: 'adventure' },
  jood: { id: 'jood', name: 'جود الشمري', bio: '', tone: 'learning' },
  turki: { id: 'turki', name: 'تركي العنزي', bio: '', tone: 'sports' },
  dana: { id: 'dana', name: 'دانة الخالدي', bio: '', tone: 'social' },
  ahmad: { id: 'ahmad', name: 'أحمد البقمي', bio: '', tone: 'games' },
}

export type Activity = {
  id: string
  title: string
  description: string
  category: CategoryId
  date: string
  time: string
  location: string
  locationDetail?: string
  maxMembers: number
  hostId: string
  participantIds: string[]
  image?: string
  cancelled?: boolean
  completed?: boolean
}

export type ActivityStatus = 'open' | 'full' | 'completed' | 'cancelled'

export function getStatus(activity: Activity): ActivityStatus {
  if (activity.cancelled) return 'cancelled'
  if (activity.completed) return 'completed'
  if (activity.participantIds.length >= activity.maxMembers) return 'full'
  return 'open'
}

export function getImage(activity: Activity) {
  return activity.image ?? CATEGORY_MAP[activity.category].image
}

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'morning-run-corniche',
    title: 'جري صباحي على الكورنيش',
    description:
      'نلتقي قبل الشروق لجولة جري خفيفة مسافتها ٥ كم بإيقاع مريح يناسب الجميع، ثم نختم بقهوة وتمارين إطالة. لا تحتاج أن تكون محترفاً، فقط أحضر حذاءً مريحاً وقارورة ماء.',
    category: 'sports',
    date: '2026-04-17',
    time: '05:45',
    location: 'كورنيش جدة الشمالي',
    locationDetail: 'بجانب نافورة الملك فهد، المدخل الرئيسي',
    maxMembers: 8,
    hostId: 'khalid',
    participantIds: ['me', 'turki', 'reem', 'layan', 'yousef'],
  },
  {
    id: 'watercolor-workshop',
    title: 'ورشة رسم بالألوان المائية',
    description:
      'جلسة هادئة نتعلم فيها أساسيات الألوان المائية: مزج الألوان، التدرجات، ورسم الزهور. الأدوات متوفرة للجميع، ويمكنك إحضار أدواتك الخاصة إن رغبت.',
    category: 'arts',
    date: '2026-04-18',
    time: '17:00',
    location: 'مقهى الزاوية الثقافي، الرياض',
    locationDetail: 'حي السليمانية، الطابق الثاني',
    maxMembers: 6,
    hostId: 'me',
    participantIds: ['maha', 'dana', 'jood', 'layan'],
  },
  {
    id: 'book-club-bamboo',
    title: 'نادي القراءة: رواية «ساق البامبو»',
    description:
      'لقاؤنا الشهري لمناقشة رواية «ساق البامبو» لسعود السنعوسي. نتحدث عن الهوية والانتماء وأسلوب السرد. اقرأ ما استطعت، فالنقاش مفتوح للجميع.',
    category: 'learning',
    date: '2026-04-20',
    time: '20:00',
    location: 'مكتبة جرير - فرع العليا، الرياض',
    locationDetail: 'ركن القراءة، الطابق الأول',
    maxMembers: 10,
    hostId: 'noura',
    participantIds: ['me', 'jood', 'maha', 'hind', 'dana', 'abdullah'],
  },
  {
    id: 'board-games-night',
    title: 'ليلة ألعاب لوحية',
    description:
      'ليلة مليئة بالضحك مع مجموعة من أجمل الألعاب اللوحية: كاتان، ديكسيت، وكودنيمز. سنشرح القواعد لمن يجرّبها لأول مرة.',
    category: 'games',
    date: '2026-04-16',
    time: '19:30',
    location: 'بورد قيم كافيه، الخبر',
    locationDetail: 'شارع الأمير تركي',
    maxMembers: 6,
    hostId: 'faisal',
    participantIds: ['yousef', 'ahmad', 'turki', 'layan', 'dana', 'abdullah'],
  },
  {
    id: 'tuwaiq-hike',
    title: 'رحلة هايكنج إلى حافة العالم',
    description:
      'مغامرة صباحية إلى جبال طويق لمشاهدة الشروق من حافة العالم. المسار متوسط الصعوبة بطول ٦ كم. سنتشارك السيارات من نقطة التجمع.',
    category: 'adventure',
    date: '2026-04-24',
    time: '05:30',
    location: 'حافة العالم، شمال غرب الرياض',
    locationDetail: 'نقطة التجمع: محطة وقود الدرعية',
    maxMembers: 12,
    hostId: 'omar',
    participantIds: ['abdullah', 'turki', 'reem', 'khalid', 'hind', 'yousef', 'ahmad'],
  },
  {
    id: 'newcomers-coffee',
    title: 'قهوة وتعارف للقادمين الجدد',
    description:
      'انتقلت حديثاً إلى المدينة؟ تعال نتعرف على بعض في جلسة قهوة خفيفة ونتبادل أجمل الأماكن والتوصيات. الجميع مرحّب بهم.',
    category: 'social',
    date: '2026-04-14',
    time: '18:00',
    location: 'نصف مليون كافيه، الرياض',
    locationDetail: 'حي الملقا',
    maxMembers: 8,
    hostId: 'me',
    participantIds: ['dana', 'layan', 'ahmad'],
  },
  {
    id: 'friendly-padel',
    title: 'مباراة بادل ودّية',
    description:
      'نبحث عن لاعب رابع لمباراة بادل ودّية بمستوى مبتدئ إلى متوسط. الملعب محجوز والمضارب متوفرة عند الحاجة.',
    category: 'sports',
    date: '2026-04-15',
    time: '21:00',
    location: 'نادي بادل إن، الرياض',
    locationDetail: 'الملعب رقم ٣',
    maxMembers: 4,
    hostId: 'reem',
    participantIds: ['me', 'turki'],
  },
  {
    id: 'mobile-photography',
    title: 'أساسيات التصوير بالجوال',
    description:
      'ورشة عملية نتعلم فيها التكوين والإضاءة وتعديل الصور باستخدام الجوال فقط، مع جولة تصوير قصيرة في الحي بعد الجزء النظري.',
    category: 'learning',
    date: '2026-04-22',
    time: '16:00',
    location: 'حي جاكس، الدرعية',
    locationDetail: 'استوديو ٢٢',
    maxMembers: 15,
    hostId: 'hind',
    participantIds: ['maha', 'jood', 'dana', 'layan', 'ahmad', 'yousef', 'reem', 'noura', 'abdullah'],
  },
  {
    id: 'national-museum-tour',
    title: 'جولة في المتحف الوطني',
    description:
      'جولة جماعية بصحبة مرشد في قاعات المتحف الوطني، نتعرف فيها على تاريخ الجزيرة العربية من العصور القديمة حتى اليوم.',
    category: 'arts',
    date: '2026-04-05',
    time: '10:00',
    location: 'المتحف الوطني، الرياض',
    locationDetail: 'البوابة الشرقية',
    maxMembers: 10,
    hostId: 'noura',
    participantIds: ['me', 'maha', 'jood', 'hind'],
    completed: true,
  },
  {
    id: 'desert-camping',
    title: 'تخييم ليلي في الصحراء',
    description: 'ليلة تحت النجوم مع شواء وجلسة سمر حول النار وتأمل للسماء بالتلسكوب.',
    category: 'adventure',
    date: '2026-04-12',
    time: '16:30',
    location: 'روضة خريم، شرق الرياض',
    maxMembers: 10,
    hostId: 'me',
    participantIds: ['abdullah', 'omar'],
    cancelled: true,
  },
]
