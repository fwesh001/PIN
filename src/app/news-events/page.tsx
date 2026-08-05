import Link from 'next/link';
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'news' | 'announcement' | 'publication';
  image?: string;
  link?: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'conference' | 'workshop' | 'webinar' | 'meeting';
  link?: string;
}

const RECENT_NEWS: NewsItem[] = [
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
    link: `${OJS_URL}/submission/wizard`,
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

const UPCOMING_EVENTS: EventItem[] = [
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCategoryBadge(category: NewsItem['category']) {
  const styles = {
    news: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    announcement: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    publication: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  };
  return styles[category];
}

function getEventTypeBadge(type: EventItem['type']) {
  const styles = {
    conference: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    workshop: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    webinar: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    meeting: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  return styles[type];
}

export const metadata = {
  title: 'News & Events — Nigerian Journal of Polymer Science and Technology',
  description: 'Stay updated with the latest news, announcements, and upcoming events from the Polymer Institute of Nigeria and NJPST.',
};

export default function NewsEventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950 transition-colors">
      {/* Navigation Header */}
      <header className="w-full bg-white dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3">
            <Logo className="h-10 w-auto sm:h-12" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-100 text-center md:text-left leading-none md:leading-tight">
              Polymer Institute of Nigeria
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-900 dark:text-blue-200">
            <a
              href="/archive"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Current Issue
            </a>
            <a
              href="/archive"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Archive
            </a>
            <a
              href="/news-events"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline font-semibold"
            >
              News & Events
            </a>
            <a
              href={`${OJS_URL}/submission/wizard`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Submit Manuscript
            </a>
            <a
              href={`${OJS_URL}/login`}
              className="px-4 py-2 rounded-md border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              Login
            </a>
          </nav>

          <MobileNav />
        </div>
      </header>

      {/* Hero Header */}
      <section className="w-full bg-blue-50 dark:bg-blue-950/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 dark:text-blue-100 leading-tight tracking-tight">
            News & Events
          </h1>
          <p className="text-base sm:text-lg text-blue-800/80 dark:text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
            Stay informed about the latest developments, publications, conferences, and activities
            from the Polymer Institute of Nigeria and the NJPST editorial office.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        {/* Recent News Section */}
        <section className="space-y-8 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100">
              Recent News
            </h2>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All News <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECENT_NEWS.map((news) => (
              <article
                key={news.id}
                className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getCategoryBadge(news.category)}`}>
                    {news.category}
                  </span>
                  <time className="text-xs text-blue-500 dark:text-blue-400" dateTime={news.date}>
                    {formatDate(news.date)}
                  </time>
                </div>

                <h3 className="text-lg font-bold text-blue-950 dark:text-blue-100 leading-snug mb-3">
                  {news.link ? (
                    <Link
                      href={news.link}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {news.title}
                    </Link>
                  ) : (
                    news.title
                  )}
                </h3>

                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed flex-1 mb-4">
                  {news.excerpt}
                </p>

                {news.link && (
                  <Link
                    href={news.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start"
                  >
                    Read More <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100">
              Upcoming Events
            </h2>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Events <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="space-y-6">
            {UPCOMING_EVENTS.map((event) => (
              <article
                key={event.id}
                className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl md:text-2xl relative">
                  <span className="z-10">{new Date(event.date).getDate()}</span>
                  <span className="absolute bottom-0 left-0 right-0 text-xs font-medium px-2 py-0.5 bg-black/20">{new Date(event.date).toLocaleDateString('en-NG', { month: 'short' })}</span>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getEventTypeBadge(event.type)}`}>
                      {event.type}
                    </span>
                    <time className="text-sm text-blue-600 dark:text-blue-400 font-medium" dateTime={event.date}>
                      {formatDate(event.date)}
                    </time>
                    <span className="text-sm text-blue-500 dark:text-blue-400">
                      {event.time}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-blue-950 dark:text-blue-100 leading-snug">
                    {event.link ? (
                      <a href={event.link} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {event.title}
                      </a>
                    ) : (
                      event.title
                    )}
                  </h3>

                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.link && (
                  <div className="flex-shrink-0 md:w-auto">
                    <a
                      href={event.link}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-300 text-white dark:text-blue-950 font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                      Register
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Past Events Link */}
          <div className="mt-10 pt-8 border-t border-blue-100 dark:border-blue-800 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Past Events Archive
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}