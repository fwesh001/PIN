export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'news' | 'announcement' | 'publication';
  image?: string;
  link?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'conference' | 'workshop' | 'webinar' | 'meeting';
  link?: string;
}

export const RECENT_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'NJPST Vol. 15, Issue 2 Now Published',
    excerpt: 'The latest issue of the Nigerian Journal of Polymer Science and Technology features 12 peer-reviewed articles covering advances in polymer composites, biopolymers, and nanomaterials.',
    date: '2026-07-15',
    category: 'publication',
    link: '/archive',
  },
  {
    id: '2',
    title: 'Call for Papers: Special Issue on Sustainable Polymers',
    excerpt: 'We invite original research articles and reviews for a special issue focusing on sustainable polymer development, recycling technologies, and circular economy approaches.',
    date: '2026-06-28',
    category: 'announcement',
    link: 'https://pinjournal.org/submission/wizard',
  },
  {
    id: '3',
    title: 'PIN Annual General Meeting 2026 Concludes Successfully',
    excerpt: 'The Polymer Institute of Nigeria held its 2026 AGM with key decisions on journal indexing strategy, membership growth, and research collaboration initiatives.',
    date: '2026-06-10',
    category: 'news',
  },
  {
    id: '4',
    title: 'NJPST Achieves DOAJ Indexing Milestone',
    excerpt: 'The Nigerian Journal of Polymer Science and Technology has been officially accepted into the Directory of Open Access Journals (DOAJ), enhancing global discoverability.',
    date: '2026-05-22',
    category: 'news',
  },
  {
    id: '5',
    title: 'New Editorial Board Members Announced',
    excerpt: 'Welcome to our new Associate Editors and Board Members joining from leading Nigerian universities, strengthening expertise in biopolymers, nanocomposites, and polymer processing.',
    date: '2026-04-30',
    category: 'announcement',
    link: '/editorial-board',
  },
  {
    id: '6',
    title: 'Young Polymer Scientist Award 2026 Open for Nominations',
    excerpt: 'Nominations are now open for the annual Young Polymer Scientist Award recognizing outstanding early-career researchers in polymer science and technology.',
    date: '2026-03-18',
    category: 'announcement',
  },
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: '1',
    title: '4th International Conference on Polymer Science & Technology (ICPST 2026)',
    description: 'A premier gathering of polymer scientists, researchers, and industry professionals from Africa and beyond. Featuring keynote lectures, technical sessions, and poster presentations.',
    date: '2026-09-15',
    time: '09:00 - 17:00 WAT',
    location: 'Abuja Continental Hotel, Abuja, FCT',
    type: 'conference',
    link: '#',
  },
  {
    id: '2',
    title: 'Workshop: Advanced Characterization Techniques for Polymer Nanocomposites',
    description: 'Hands-on workshop covering TEM, SEM, XRD, DSC, TGA, and rheological characterization methods. Limited seats available for early-career researchers.',
    date: '2026-10-08',
    time: '10:00 - 16:00 WAT',
    location: 'Federal University of Technology, Owerri',
    type: 'workshop',
    link: '#',
  },
  {
    id: '3',
    title: 'Webinar Series: Sustainable Polymer Solutions for Africa',
    description: 'Monthly webinar series addressing biodegradable polymers, plastic waste management, and green chemistry approaches tailored to African contexts.',
    date: '2026-08-20',
    time: '14:00 - 15:30 WAT',
    location: 'Virtual (Zoom)',
    type: 'webinar',
    link: '#',
  },
  {
    id: '4',
    title: 'PIN Council Meeting & Strategic Planning Session',
    description: 'Quarterly council meeting to review journal performance, discuss indexing progress, and plan 2027 activities including special issues and conferences.',
    date: '2026-11-05',
    time: '10:00 - 14:00 WAT',
    location: 'PIN National Headquarters, Abuja',
    type: 'meeting',
  },
  {
    id: '5',
    title: 'Young Researchers Forum: Polymer Innovation Showcase',
    description: 'Platform for graduate students and early-career researchers to present their work, receive feedback, and network with established scientists.',
    date: '2026-12-12',
    time: '09:00 - 16:00 WAT',
    location: 'University of Lagos, Lagos',
    type: 'conference',
    link: '#',
  },
];