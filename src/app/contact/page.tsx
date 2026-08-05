import Link from 'next/link';
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

export const metadata = {
  title: 'Contact Us — Nigerian Journal of Polymer Science and Technology',
  description: 'Get in touch with the Polymer Institute of Nigeria and the editorial team of NJPST.',
};

export default function ContactPage() {
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
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
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
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-blue-800/80 dark:text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
            We welcome your inquiries. Whether you have questions about submissions, editorial policies,
            or partnership opportunities, our team is here to assist you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
              National Headquarters
            </h2>

            <div className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Address</h3>
                <address className="not-italic text-blue-800 dark:text-blue-200 leading-relaxed space-y-1">
                  <p><strong>Suite 29 & 30, Decent Plaza</strong></p>
                  <p>Behind G.S.S. Gwarimpa</p>
                  <p>Life camp, Abuja, FCT</p>
                  <p>Nigeria</p>
                </address>
              </div>

              <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Phone</h3>
                <a
                  href="tel:+2348035472743"
                  className="text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xl font-medium"
                >
                  +234 803 547 2743
                </a>
              </div>

              <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Email</h3>
                <a
                  href="mailto:emailus@polymerinstitute.org.ng"
                  className="text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xl font-medium break-all"
                >
                  emailus@polymerinstitute.org.ng
                </a>
              </div>
            </div>

            {/* Additional contact options */}
            <div className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100 mb-4">Other Ways to Connect</h3>
              <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">✉</span>
                  <div>
                    <p className="font-medium">General Inquiries</p>
                    <p className="text-sm">emailus@polymerinstitute.org.ng</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">📄</span>
                  <div>
                    <p className="font-medium">Editorial Office</p>
                    <p className="text-sm">editor@polymerinstitute.org.ng</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">🌐</span>
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-sm">journal.polymerinstitute.org.ng</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Form / Quick Links */}
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
              Quick Links
            </h2>

            <div className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">For Authors</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={`${OJS_URL}/submission/wizard`}
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> Submit Manuscript
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> Author Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> APC & Waiver Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">For Reviewers</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> Reviewer Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`${OJS_URL}/login`}
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> Reviewer Login
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Editorial Board</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/editorial-board"
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> View Editorial Board
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Archive & Publications</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/archive"
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> Browse Archive
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/archive"
                      className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>→</span> Current Issue
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-blue-600 dark:text-blue-400 text-lg font-medium">Map Location</p>
                  <p className="text-sm text-blue-500 dark:text-blue-500 mt-2">
                    Suite 29 & 30, Decent Plaza, Behind G.S.S. Gwarimpa, Life camp, Abuja, FCT
                  </p>
                  <p className="text-xs text-blue-400 dark:text-blue-600 mt-4">
                    Interactive map integration coming soon
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}