import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Footer link with a white "ripple" underline that expands from the centre
 * out to both sides on hover.
 */
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    'group relative inline-block font-mono font-bold text-blue-300 hover:text-white transition-colors';
  const ripple = (
    <>
      {/* Left-side line origin */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 w-1/2 h-px bg-white/70 rounded-full origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
      />
      {/* Right-side line origin */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-1/2 w-1/2 h-px bg-white/70 rounded-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
      />
    </>
  );

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
        {ripple}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
      {ripple}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-blue-200 mt-auto">
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
                <FooterLink href="/editorial-board">Editor-in-Chief</FooterLink>
              </li>
              <li>
                <FooterLink href="/editorial-board">Associate Editors</FooterLink>
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
                <FooterLink href="/guidelines?tab=reviewers">
                  Reviewers Guidelines
                </FooterLink>
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
                <FooterLink href="/dashboard/author/submit">
                  Submit Manuscript
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/guidelines?tab=authors">
                  Author Guidelines
                </FooterLink>
              </li>
              <li>
                <FooterLink href="#">APC &amp; Waiver Policy</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 5 — Indexing */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Indexing &amp; Compliance
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
                <FooterLink href="/contact">Address</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Email</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Via Phone</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 7 — News & Events */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              News &amp; Events
            </h4>
            <ul className="space-y-1.5 text-sm text-blue-300">
              <li>
                <FooterLink href="/news-events">Recent News</FooterLink>
              </li>
              <li>
                <FooterLink href="/news-events">Upcoming Events</FooterLink>
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
                <FooterLink href="/policies?tab=scope">
                  Scope of the Journal
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/policies?tab=terms">Terms of Use</FooterLink>
              </li>
              <li>
                <FooterLink href="/policies?tab=copyright">Copyright</FooterLink>
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
                <FooterLink href="/guidelines?tab=reviewers">
                  Reviewers Guidelines
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/guidelines?tab=authors">
                  Authors Guidelines
                </FooterLink>
              </li>
            </ul>
          </div>
          </div>


        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
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