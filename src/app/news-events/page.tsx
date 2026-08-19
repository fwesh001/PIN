import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { RECENT_NEWS, UPCOMING_EVENTS } from '@/lib/newsEvents';
import type { EventItem, NewsItem } from '@/lib/newsEvents';

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
      <Navigation />

      {/* Hero Header */}
      <section className="w-full bg-blue-50 dark:bg-blue-950/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      >
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
                id={`news-${news.id}`}
                className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col scroll-mt-28"
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
                id={`event-${event.id}`}
                className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6 scroll-mt-28"
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