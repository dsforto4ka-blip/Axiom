import { PcBuild, Advantage, WorkStep } from '../types';

export const PC_BUILDS: PcBuild[] = [
  {
    id: 'standart',
    name: 'СТАНДАРТ',
    badge: 'Офис / Учеба',
    category: 'office',
    tagline: 'Надёжная рабочая лошадка для учебы, работы с документами и базового гейминга',
    price: 40000,
    formattedPrice: '40 000 ₽',
    specs: {
      cpu: 'AMD Ryzen 5 3600 (6 ядер / 12 потоков)',
      gpu: 'NVIDIA GeForce GTX 1660 Super 6GB',
      ram: '16GB DDR4 3200MHz Dual Channel',
      storage: 'SSD 512GB M.2 NVMe',
      motherboard: 'B450M PRO Series',
      cooling: 'DeepCool Башенный кулер 130W',
      powerSupply: '550W 80+ Bronze',
    },
    fpsHighlights: [
      { game: 'CS2 (1080p)', fps: '140+ FPS' },
      { game: 'Dota 2 (1080p)', fps: '160+ FPS' },
      { game: 'GTA V (Высокие)', fps: '85+ FPS' },
    ],
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    popular: false,
  },
  {
    id: 'gaming',
    name: 'ИГРОВОЙ',
    badge: 'ХИТ ПРОДАЖ',
    category: 'gaming',
    tagline: 'Идеальный баланс для комфортного гейминга в 2K разрешении на ультра-настройках',
    price: 65000,
    formattedPrice: '65 000 ₽',
    specs: {
      cpu: 'AMD Ryzen 5 5600 (6 ядер / 12 потоков, до 4.4 GHz)',
      gpu: 'NVIDIA GeForce RTX 3060 Ti 8GB GDDR6X',
      ram: '16GB (2x8GB) Kingston FURY DDR4 3600MHz',
      storage: 'SSD 1TB M.2 PCIe 4.0 (3500 MB/s)',
      motherboard: 'B550 Gaming Plus с радиаторами VRM',
      cooling: 'ID-Cooling SE-224-XTS ARGB',
      powerSupply: '650W DeepCool 80+ Gold',
    },
    fpsHighlights: [
      { game: 'Cyberpunk 2077 (2K RT)', fps: '75+ FPS' },
      { game: 'CS2 (1440p High)', fps: '240+ FPS' },
      { game: 'Warzone (2K Ultra)', fps: '110+ FPS' },
    ],
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    popular: true,
  },
  {
    id: 'profi',
    name: 'ПРОФИ',
    badge: 'Для 3D / Монтажа / AI',
    category: 'pro',
    tagline: 'Флагманская производительность для рендеринга, 4K видеомонтажа и тяжелых нейросетей',
    price: 140000,
    formattedPrice: '140 000 ₽',
    specs: {
      cpu: 'AMD Ryzen 7 5700X (8 ядер / 16 потоков, Boost 4.6 GHz)',
      gpu: 'NVIDIA GeForce RTX 4070 12GB GDDR6X DLSS 3.0',
      ram: '64GB (2x32GB) DDR4 3600MHz Kingston Fury',
      storage: 'SSD 2TB Samsung 980 PRO NVMe PCIe 4.0',
      motherboard: 'X570S / B550 Premium WiFi',
      cooling: 'СЖО 240mm Liquid Cooler ARGB',
      powerSupply: '750W 80+ Gold Full Modular',
    },
    fpsHighlights: [
      { game: 'Blender Render', fps: '4.2x быстрее' },
      { game: 'Cyberpunk 2077 (4K Ultra DLSS)', fps: '90+ FPS' },
      { game: 'Premiere Pro 4K timeline', fps: 'Zero Lag' },
    ],
    image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=80',
    popular: false,
  },
];

export const ADVANTAGES: Advantage[] = [
  {
    id: 'individual',
    iconName: 'Wrench',
    title: 'Индивидуальный подход',
    description: 'Соберём ПК строго под ваши задачи, бюджет и предпочтения по дизайну и подсветке.',
    highlight: 'Любые задачи',
  },
  {
    id: 'original',
    iconName: 'Zap',
    title: 'Только оригинальные комплектующие',
    description: 'Официальные поставки с полноценной гарантией от ведущих мировых производителей.',
    highlight: '100% гарантия',
  },
  {
    id: 'free_assembly',
    iconName: 'Rocket',
    title: 'Бесплатная сборка и настройка',
    description: 'Профессиональный кабель-менеджмент, обновление и тонкая настройка BIOS, установка драйверов.',
    highlight: '0 ₽ за работу',
  },
  {
    id: 'delivery',
    iconName: 'Package',
    title: 'Доставка по всей России',
    description: 'Бережная доставка в надёжной двойной упаковке и пусконаладка на дому с проверкой при вас.',
    highlight: 'По всей РФ',
  },
];

export const WORK_STEPS: WorkStep[] = [
  {
    step: 1,
    title: 'Вы оставляете заявку',
    description: 'Укажите ваши задачи, бюджет и пожелания на сайте или свяжитесь с нами удобным способом.',
    iconName: 'FileText',
  },
  {
    step: 2,
    title: 'Подбираем комплектующие',
    description: 'Формируем точную смету с идеальным балансом цена/производительность без переплат.',
    iconName: 'Sliders',
  },
  {
    step: 3,
    title: 'Собираем и тестируем 24 часа',
    description: 'Идеальный кабель-менеджмент, термопрофиль, стресс-тесты FurMark, OCCT и AIDA64.',
    iconName: 'Cpu',
  },
  {
    step: 4,
    title: 'Доставляем или самовывоз',
    description: 'Вы получаете полностью готовый к работе ПК со всеми коробками, чеками и гарантией 3 года.',
    iconName: 'CheckCircle2',
  },
];
