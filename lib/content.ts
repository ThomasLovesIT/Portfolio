export type Story = { n: string; h: 'Situation' | 'Idea' | 'Solution' | 'Result'; b: string };
export type Shot = { src: string | null; label: string };
export type Project = {
  slug: string; idx: string; title: string; sub: string; period: string;
  tags: string[]; stack: string; role: string; cursor: string; summary: string;
  story: Story[]; shots: Shot[]; liveUrl?: string; repoUrl?: string;
};

export const site = {
  name: 'Thomas Joaquin Bernardo',
  domain: 'thomasbern.dev',
  heroLabel: '// web developer — portfolio 2026',
  email: 'thomasbernardo910@gmail.com',
  github: 'https://github.com/ThomasLovesIT',
  linkedin: 'https://www.linkedin.com/in/bernardothomas/',
  resume: '/Bernardo_Resume.pdf',
  location: 'Laguna, Philippines',
  replyTime: 'Within 24 hours',
  cursorName: 'Joaquin',
};

// Typed hero intro. 't' = text, 'c' = chip [label, icon]. A chip counts as 4 chars of typing time.
export const intro: (['t', string] | ['c', string, string])[] = [
  ['t', "I'm a "], ['c', 'full-stack', '</>'], ['t', ' web developer with 3 years of building.'],
  ['t', ' I make '], ['c', 'business systems', '▤'], ['t', ' and '], ['c', 'websites', '◐'],
  ['t', " for real clients, and lately I've been exploring "], ['c', 'AI tools', '✳'], ['t', '.'],
];

export const cursorMessages = {
  heroTyping: 'Writing my intro…',
  heroDone: 'Strong hire. Ask about the clinic system.',
  work: 'This one runs a real clinic. Hover it.',
  path: 'Scroll slowly — it draws itself.',
  contact: 'Fill in the blanks. Takes 20 seconds.',
};

const story = (a: string, b: string, c: string, d: string): Story[] => [
  { n: '01', h: 'Situation', b: a }, { n: '02', h: 'Idea', b: b }, { n: '03', h: 'Solution', b: c }, { n: '04', h: 'Result', b: d },
];

export const projects: Project[] = [
  {
    slug: 'forbes-optical', idx: '01', title: 'Forbes Optical Clinic', sub: 'Clinic management system', period: 'Nov – Dec 2026',
    tags: ['Next.js', 'TypeScript', 'MySQL'], stack: 'Next.js · TypeScript · Prisma · MySQL · Better Auth · Tailwind · shadcn/ui', role: 'Freelance full-stack developer',
    cursor: 'Real clinic, real patients. Scroll the screens.',
    summary: 'A clinic management system for Forbes Optical: patients, eye exams, bills, installments and collections in one place, replacing the paper ledgers the front desk used to track who owed what.',
    story: story(
      'Installments and cash payments were tracked by hand on paper. The clinic couldn’t tell who was overdue or who had stopped paying.',
      'One platform that controls the whole money trail: a patient list, bills and payment tracking, reports, and an audit log of every change.',
      'Patient profiles with exam history, bills with partial payments across cash, bank and online, overdue tracking on the dashboard, collection reports and a full audit log.',
      'Hours saved on daily closing, overdue bills recovered, and a client who now knows exactly who owes what.'),
    shots: [
      { src: '/forbes-1.png', label: 'Dashboard' }, { src: '/forbes-2.png', label: 'Patients' }, { src: '/forbes-3.png', label: 'Patient profile' },
      { src: '/forbes-4.png', label: 'Eye exam' }, { src: '/forbes-5.png', label: 'Bills & payments' }, { src: '/forbes-6.png', label: 'Collections report' },
    ],
  },
  {
    slug: 'lotus', idx: '02', title: 'LotUs', sub: 'Secure enterprise raffle system', period: 'May – Jul 2026',
    tags: ['React', 'Express', 'PostgreSQL'], stack: 'React · Node/Express · PostgreSQL · Supabase · Docker', role: 'Team lead, 10 engineers',
    cursor: 'Ask how the draw stays tamper-proof.',
    summary: 'LotUs runs company raffles with 20,000+ entries where every entry gets an equal, provable chance. Managers upload entries, configure rounds, brand the draw screen, and pick winners live.',
    story: story(
      'A company needed a raffle for 20,000+ entries that was secure and provably fair, with every entry given an equal chance. No existing tool could handle that scale.',
      'A draw engine people can audit: cryptographically secure randomness, winners locked the moment they’re picked, and a log of every action.',
      'Node’s crypto.randomInt CSPRNG, a SHA-256 hash of every winner record, Postgres advisory locks against concurrent draws, and a chunked CSV/XLSX import that validates 20,000+ rows into per-event partitions.',
      'Every draw is truly random, tamper-evident and verifiable after the fact. Winners can’t be re-rolled or edited, so the result holds up when anyone asks.'),
    shots: [
      { src: '/lotus-1.png', label: 'Sign in' }, { src: '/lotus-2.png', label: 'Events' }, { src: '/lotus-3.png', label: 'Branding — wheel draw' },
      { src: '/lotus-4.png', label: 'Branding — slot reveal' }, { src: '/lotus-5.png', label: 'Participant upload & validation' },
      { src: '/lotus-6.png', label: 'Draw results & export' }, { src: '/lotus-7.png', label: 'Pending invites' },
    ],
  },
  {
    slug: 'ai-study-assistant', idx: '03', title: 'AI Study Assistant', sub: 'Generative-AI learning platform', period: 'Jan – Feb 2026',
    tags: ['MERN', 'Gemini'], stack: 'MongoDB · Express · React (Vite) · Node · Google Gemini 2.5 Flash-Lite · Tailwind · JWT', role: 'Solo developer',
    cursor: 'A 10-page PDF to a quiz in under 30s.',
    summary: 'A study platform that turns raw PDFs into structured study materials: 20+ flashcards and 10 quiz questions from a 10-page PDF in under 30 seconds.',
    story: story(
      'Studying from long lecture PDFs means rereading them, then writing flashcards and practice questions by hand. That is hours of prep before any real studying starts.',
      'Let one upload do the prep: flashcards, a quiz, a summary and a chat that answers from that document only, so every answer stays tied to the course material instead of a general chatbot’s guesses.',
      'Upload a PDF; the backend extracts the text, splits it into 500-word overlapping chunks, and prompts Gemini for flashcards, multiple-choice quizzes and summaries. Chat questions pull the most relevant chunks as context. Everything is stored per user in MongoDB behind JWT auth, with a dashboard that tracks progress.',
      '20+ flashcards and 10 quiz questions from a 10-page PDF in under 30 seconds.'),
    shots: [
      { src: null, label: 'Dashboard' }, { src: null, label: 'Documents' }, { src: null, label: 'Flashcards' },
      { src: null, label: 'Quiz' }, { src: null, label: 'Chat with your PDF' },
    ],
  },
];

// Path timeline — SVG viewBox 0 0 1000 2000. Node x/y are in viewBox units (render as x/10 %, y/20 %).
export const PATH_D =
  'M150 0 C150 150 240 200 240 300 C240 480 60 560 300 610 C460 640 560 540 520 480 C480 420 400 520 520 570 C700 640 720 700 720 820 C720 1010 300 1000 300 1160 C300 1220 300 1260 300 1300 C300 1500 680 1540 680 1700 L680 1800 C680 1900 500 1950 500 2000';

export const milestones = [
  { x: 240, y: 300, num: '01', when: '2023', title: 'BSIT, LPU Laguna', side: 'left',
    body: "Started a BS in Information Technology at Lyceum of the Philippines University – Laguna. Dean's Lister." },
  { x: 720, y: 820, num: '02', when: 'Jan – Feb 2026', title: 'AI Study Assistant', side: 'right',
    body: 'Built a generative-AI study platform on MERN and Gemini that turns PDFs into flashcards and quizzes.' },
  { x: 300, y: 1300, num: '03', when: 'May – Jul 2026', title: 'LotUs', side: 'left',
    body: 'Led a 10-person team building a secure raffle engine for 20,000+ entries, with CI/CD and code review on every merge.' },
  { x: 680, y: 1800, num: '04', when: '2026 — now', title: 'Freelance', side: 'right',
    body: 'Building systems and websites for clients — most recently a full management system for Forbes Optical Clinic.' },
] as const;

export const contact = {
  roles: ['a full-time role', 'a contract', 'a freelance project', 'something else'],
  starts: ['ASAP', 'this quarter', 'just exploring'],
};
