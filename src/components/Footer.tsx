import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-blue-950 text-blue-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Column 1 — About */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              About NJPST
            </h4>
            <p className="text-sm leading-relaxed text-blue-300">
              The Nigerian Journal of Polymer Science and Technology is
              the open-access academic journal of the Polymer Institute
              of Nigeria (PIN), advancing polymer research since 1994.
            </p>
          </div>

          {/* Column 2 — Editorial Board */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Editorial Board
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link href="/editorial-board" className="hover:text-white transition-colors">
                  Editor-in-Chief
                </Link>
              </li>
              <li>
                <Link href="/editorial-board" className="hover:text-white transition-colors">
                  Associate Editors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Reviewer Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              For Reviewers
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link href="/guidelines?tab=reviewers" className="hover:text-white transition-colors">
                  Reviewers Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Author Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              For Authors
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link
                  href="/dashboard/author/submit"
                  className="hover:text-white transition-colors"
                >
                  Submit Manuscript
                </Link>
              </li>
              <li>
                <a href="/guidelines?tab=authors" className="hover:text-white transition-colors">
                  Author Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  APC & Waiver Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 — Indexing */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Indexing & Compliance
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>Google Scholar</li>
              <li>Scopus (in progress)</li>
              <li>DOAJ (in progress)</li>
              <li>AJOL Metadata Harvesting</li>
              <li>Crossref DOI Registration</li>
            </ul>
          </div>

          {/* Column 6 — Contact Us */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Address
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Email
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Via Phone
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 7 — News & Events */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              News & Events
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link href="/news-events" className="hover:text-white transition-colors">
                  Recent News
                </Link>
              </li>
              <li>
                <Link href="/news-events" className="hover:text-white transition-colors">
                  Upcoming Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 8 — Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link href="/policies?tab=scope" className="hover:text-white transition-colors">
                  Scope of the Journal
                </Link>
              </li>
              <li>
                <Link href="/policies?tab=terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/policies?tab=copyright" className="hover:text-white transition-colors">
                  Copyright
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 9 — Guidelines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Guidelines
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <Link href="/guidelines?tab=reviewers" className="hover:text-white transition-colors">
                  Reviewers Guidelines
                </Link>
              </li>
              <li>
                <Link href="/guidelines?tab=authors" className="hover:text-white transition-colors">
                  Authors Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
          <p>
            © {new Date().getFullYear()} Polymer Institute of Nigeria.
            All rights reserved.
          </p>
          <p>
            Developed by{' '}
            <span className="text-blue-300">
              zabdiel
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}