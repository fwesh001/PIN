'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

type TabKey = 'scope' | 'copyright' | 'terms';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'scope', label: 'Scope of the Journal' },
  { key: 'copyright', label: 'Copyright' },
  { key: 'terms', label: 'Terms of Use' },
];

export default function PoliciesPage() {
  return (
    <Suspense fallback={null}>
      <PoliciesContent />
    </Suspense>
  );
}

function PoliciesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('scope');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tab = searchParams.get('tab') as TabKey | null;
    if (tab && ['scope', 'copyright', 'terms'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!mounted) {
    return null; // or return a loading skeleton
  }

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
      <section className="w-full bg-blue-50 dark:bg-blue-950/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 dark:text-blue-100 leading-tight tracking-tight">
            Policies & Guidelines
          </h1>
          <p className="text-base sm:text-lg text-blue-800/80 dark:text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
            Editorial policies, copyright terms, and usage guidelines for the Nigerian Journal of Polymer Science and Technology.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        {/* Tab Navigation */}
        <nav className="mb-8" aria-label="Policy sections">
          <div className="border-b border-blue-200 dark:border-blue-800">
            <ul className="flex flex-wrap gap-1 -mb-px" role="tablist">
              {tabs.map((tab) => (
                <li key={tab.key} role="presentation">
                  <button
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    aria-controls={`panel-${tab.key}`}
                    id={`tab-${tab.key}`}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      activeTab === tab.key
                        ? 'bg-white dark:bg-blue-900 text-blue-950 dark:text-blue-100 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Tab Panels */}
        <div className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm">
          {/* Scope of the Journal */}
          <div
            role="tabpanel"
            id="panel-scope"
            aria-labelledby="tab-scope"
            className={activeTab === 'scope' ? 'block' : 'hidden'}
          >
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
                Scope of the Journal
              </h2>

              <div className="prose prose-blue dark:prose-invert max-w-none space-y-6">
                <p className="text-lg leading-relaxed text-blue-800 dark:text-blue-200">
                  The <strong>Nigerian Journal of Polymer Science and Technology (NJPST)</strong> is devoted to publishing original research and short communications in all aspects of Polymer Science and Technology (Engineering).
                </p>

                <p className="leading-relaxed text-blue-800 dark:text-blue-200">
                  Articles in the related discipline of materials science technology and application will also be considered for publication.
                </p>

                <div className="pt-6 border-t border-blue-100 dark:border-blue-800 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Topics Covered Include (but are not limited to):</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Polymer synthesis and characterization</li>
                    <li>Polymer physics and chemistry</li>
                    <li>Polymer processing and engineering</li>
                    <li>Polymer composites and nanocomposites</li>
                    <li>Biopolymers and biomaterials</li>
                    <li>Polymer degradation and stability</li>
                    <li>Polymer rheology and viscoelasticity</li>
                    <li>Smart and functional polymers</li>
                    <li>Polymer recycling and sustainability</li>
                    <li>Materials science and technology applications</li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-blue-100 dark:border-blue-800 space-y-4">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Article Types:</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li><strong>Original Research Articles</strong> — Full-length papers reporting novel findings</li>
                    <li><strong>Short Communications</strong> — Brief reports of significant preliminary findings</li>
                    <li><strong>Review Articles</strong> — Critical assessments of the literature (by invitation or proposal)</li>
                    <li><strong>Technical Notes</strong> — New methods, techniques, or apparatus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            role="tabpanel"
            id="panel-copyright"
            aria-labelledby="tab-copyright"
            className={activeTab === 'copyright' ? 'block' : 'hidden'}
          >
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
                Copyright
              </h2>

              <div className="prose prose-blue dark:prose-invert max-w-none space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/50 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                  <p className="text-lg leading-relaxed text-blue-800 dark:text-blue-200">
                    <strong>By submitting a manuscript, the authors agree that the copyright for the article is transferred to the Polymer Institute of Nigeria, if and when the article is accepted for publication.</strong>
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Copyright Transfer Details:</h3>
                  <ul className="list-disc list-inside space-y-3 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Copyright transfer takes effect upon formal acceptance of the manuscript for publication.</li>
                    <li>The Polymer Institute of Nigeria (PIN) becomes the copyright holder of the published article.</li>
                    <li>Authors retain the right to use their work for non-commercial purposes (teaching, research, presentations) with proper attribution.</li>
                    <li>Authors may post a pre-print version on personal or institutional repositories with acknowledgment of the final publication.</li>
                    <li>The final published version (publisher's PDF) may not be posted on public repositories without written permission from PIN.</li>
                  </ul>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Open Access & Licensing:</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    NJPST is a Gold Open Access journal. All published articles are made freely available online immediately upon publication.
                  </p>
                  <ul className="list-disc list-inside space-y-3 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Articles are published under the <strong>Creative Commons Attribution License (CC BY 4.0)</strong> unless otherwise stated.</li>
                    <li>This permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.</li>
                    <li>Commercial use is permitted with appropriate attribution.</li>
                  </ul>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Author Responsibilities:</h3>
                  <ul className="list-disc list-inside space-y-3 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Ensure the manuscript is original and has not been published elsewhere.</li>
                    <li>Obtain permission for any copyrighted material (figures, tables, extensive quotes) used in the manuscript.</li>
                    <li>Provide proper attribution for all sources.</li>
                    <li>Disclose any conflicts of interest.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Terms of Use */}
          <div
            role="tabpanel"
            id="panel-terms"
            aria-labelledby="tab-terms"
            className={activeTab === 'terms' ? 'block' : 'hidden'}
          >
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
                Terms of Use
              </h2>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">1. Permitted Uses</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Any uses and/or copies of the content of NJPST journals in whole or in part must include the customary bibliographic citation, including author attribution, date, and article title.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Personal, educational, and research use is permitted.</li>
                    <li>Text and data mining for non-commercial research is permitted.</li>
                    <li>Sharing links to articles is encouraged.</li>
                  </ul>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">2. Restrictions</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Use may also require permission from the relevant publisher (Polymer Institute of Nigeria) for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Commercial reproduction or distribution.</li>
                    <li>Systematic downloading or scraping of content.</li>
                    <li>Creation of derivative works (translations, adaptations) for commercial purposes.</li>
                    <li>Posting the publisher's final PDF on commercial platforms.</li>
                  </ul>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">3. Content Responsibility</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    NJPST accepts content from journals in good faith, with the understanding that the material contains nothing that is libellous, illegal, or an infringement of anyone's copyright or other rights.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>NJPST retains the right to refuse to place any content on the website.</li>
                    <li>NJPST retains the right to remove anything considered unsuitable.</li>
                    <li>The data and opinions appearing in articles are the responsibility of the contributor/author concerned.</li>
                    <li>NJPST makes no warranty regarding the quality, accuracy, or validity of data in articles.</li>
                  </ul>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">4. Limitation of Liability</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    In no event shall NJPST or the Polymer Institute of Nigeria be liable for any special, incidental, indirect, or consequential damages of any kind arising out of or in connection with the use of the articles or other material derived from the NJPST website, whether or not advised of the possibility of damage, and on any theory of liability.
                  </p>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">5. No Warranty</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    This service is provided <strong>"as is"</strong> without warranty of any kind, either expressed or implied, including, but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Implied warranties of merchantability</li>
                    <li>Fitness for a particular purpose</li>
                    <li>Non-infringement</li>
                    <li>Quality, accuracy, availability, or validity of data or information</li>
                  </ul>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">6. External Links</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    NJPST makes no warranty of any kind regarding any other site to which it may be linked. While every effort is made to see that no inaccurate or misleading data, opinion, or statement appears on this website, NJPST wishes to make it clear that the data and opinions appearing in the articles are the responsibility of the contributor or author concerned.
                  </p>
                </div>

                <div className="space-y-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">7. Changes & Updates</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    The NJPST website is continuously under development and changes may be made to the website and these publications at any time. Users are encouraged to review these terms periodically.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}