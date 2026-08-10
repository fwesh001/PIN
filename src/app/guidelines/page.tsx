'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

type TabKey = 'reviewers' | 'authors';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'reviewers', label: 'Reviewers Guidelines' },
  { key: 'authors', label: 'Authors Guidelines' },
];

export default function GuidelinesPage() {
  return (
    <Suspense fallback={null}>
      <GuidelinesContent />
    </Suspense>
  );
}

function GuidelinesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('reviewers');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tab = searchParams.get('tab') as TabKey | null;
    if (tab && ['reviewers', 'authors'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!mounted) {
    return null;
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
            Guidelines
          </h1>
          <p className="text-base sm:text-lg text-blue-800/80 dark:text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
            Guidelines for reviewers and authors of the Nigerian Journal of Polymer Science and Technology.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        {/* Tab Navigation */}
        <nav className="mb-8" aria-label="Guideline sections">
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
          {/* Reviewers Guidelines */}
          <div
            role="tabpanel"
            id="panel-reviewers"
            aria-labelledby="tab-reviewers"
            className={activeTab === 'reviewers' ? 'block' : 'hidden'}
          >
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
                Reviewers Guidelines
              </h2>

              <div className="prose prose-blue dark:prose-invert max-w-none space-y-6">
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Introduction</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    The review process is an important aspect of the publication process of an article. It helps an editor in making decision on an article and also enables the author to improve the manuscript.
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    The journal operates a <strong>blind peer review system</strong>.
                  </p>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Before Accepting to Review</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Reviewers should ensure that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>the manuscript is within their area of expertise.</li>
                    <li>they can dedicate the appropriate time to conduct a critical review of the manuscript.</li>
                  </ul>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Conflict of Interest</h3>
                  <blockquote className="border-l-4 border-blue-600 pl-4 italic text-blue-700 dark:text-blue-300">
                    <p>
                      "Conflict of interest (COI) exists when there is a divergence between an individual's private interests (competing interests) and his or her responsibilities to scientific and publishing activities such that a reasonable observer might wonder if the individual's behavior or judgment was motivated by considerations of his or her competing interests"
                    </p>
                    <cite className="block mt-2 text-sm not-italic">— WAME</cite>
                  </blockquote>
                  <blockquote className="border-l-4 border-blue-600 pl-4 italic text-blue-700 dark:text-blue-300 mt-4">
                    <p>
                      "Reviewers should declare their conflicts of interest and recuse themselves from the peer-review process if a conflict exists"
                    </p>
                    <cite className="block mt-2 text-sm not-italic">— ICMJE</cite>
                  </blockquote>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Confidentiality</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Manuscripts are confidential materials given to a reviewer in trust for the sole purpose of critical evaluation. Reviewers should ensure that the review process is confidential. Details of the manuscript and the review process should remain confidential during and after the review process.
                  </p>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Plagiarism</h3>
                  <blockquote className="border-l-4 border-blue-600 pl-4 italic text-blue-700 dark:text-blue-300">
                    <p>
                      "The practice of taking someone else's work or ideas and passing them off as one's own"
                    </p>
                    <cite className="block mt-2 text-sm not-italic">— Oxford Dictionaries</cite>
                  </blockquote>
                  <blockquote className="border-l-4 border-blue-600 pl-4 italic text-blue-700 dark:text-blue-300 mt-4">
                    <p>
                      "It is unethical for reviewers to use information obtained during the peer-review process for their own or any other person's or organization's advantage, or to disadvantage or discredit others"
                    </p>
                    <cite className="block mt-2 text-sm not-italic">— COPE</cite>
                  </blockquote>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Fairness</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Reviews should be honest and objective. Reviewers should not be influenced by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>The origin of the manuscript</li>
                    <li>Religious, political or cultural viewpoint of the author</li>
                    <li>Gender, race, ethnicity or citizenry of the author</li>
                  </ul>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Review Reports</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    In evaluating a manuscript, reviewers should focus on the following:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Originality</li>
                    <li>Contribution to the field</li>
                    <li>Technical quality</li>
                    <li>Clarity of presentation</li>
                    <li>Depth of research</li>
                  </ul>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed mt-4">
                    Reviewers should also:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Observe that the author(s) have followed the instruction for authors, editorial policies and publication ethics.</li>
                    <li>Observe that the appropriate journal's reporting guidelines is followed.</li>
                  </ul>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed mt-4">
                    The report should be accurate, objective, constructive and unambiguous. Comments should be backed by facts and constructive arguments with regards to the content of the manuscript. Reviewers should avoid using "hostile, derogatory and accusatory comments" (PIE).
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed mt-4">
                    Reviewers should not rewrite the manuscript; however necessary corrections and suggestions for improvements should be made.
                  </p>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Timeliness</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Reviewers should only accept manuscript that they are confident that they can dedicate appropriate time in reviewing. Thus, reviewers should review and return manuscripts in a timely manner.
                  </p>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Recommendations</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Reviewers' recommendation should be either:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li>Accept</li>
                    <li>Requires minor corrections</li>
                    <li>Requires moderate revision</li>
                    <li>Requires major revision</li>
                    <li>Not suitable for the journal. Submit to another publication such as (suggest a journal):</li>
                    <li>Reject</li>
                  </ul>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed mt-4">
                    Recommendation should be backed with constructive arguments and facts based on the content of the manuscript.
                  </p>
                </section>

                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Resources</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-300 pl-4">
                    <li><a href="https://publicationethics.org/files/cope-ethical-guidelines-peer-reviewers.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-100">COPE Ethical Guidelines for Peer Reviewers</a></li>
                    <li><a href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/responsibilities-in-the-submission-and-peer-review-process.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-100">ICMJE - Responsibilities in the Submission and Peer-Review Process</a></li>
                    <li><a href="https://www.wame.org/conflict-of-interest-in-peer-reviewed-medical-journals" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-100">WAME - Conflict of Interest in Peer-Reviewed Medical Journals</a></li>
                  </ul>
                </section>
              </div>
            </div>
          </div>

          {/* Authors Guidelines */}
          <div
            role="tabpanel"
            id="panel-authors"
            aria-labelledby="tab-authors"
            className={activeTab === 'authors' ? 'block' : 'hidden'}
          >
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
                Authors Guidelines
              </h2>

              <div className="prose prose-blue dark:prose-invert max-w-none space-y-6">
                {/* Preparation of Manuscript */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-950 dark:text-blue-100"><b className="font-mono font-weight=800">*</b>INSTRUCTIONS FOR AUTHORS<b className="font-mono font-weight=800">*</b></h3>
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Preparation of Manuscript</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Manuscript should be written in the third person in an objective, formal and impersonal style. The SI system should be used for all scientific and laboratory data. The full stop should not be included in abbreviations, example m (not m.) ppm not (p.p.m.). All mathematical expressions should be included in the manuscript. Care should be taken to distinguish between capital and lowercase letters, between zero (0) and letter (O), between the numeral (1) and letter (I), etc. Mathematical expressions should fit into a single column when set in type. Fractional powers are preferred to root signs and should always be used in more elaborate formulas. The solids (/) should be used instead of the horizontal lines for fractions whenever possible. Numbers that identify mathematical expressions should be enclosed in parentheses. Refer to equations in the text as "Eq. (1)", etc., or "Equation (1)", etc., at the beginning of a sentence.
                  </p>
                </section>

                {/* Content */}
                <section className="space-y-4 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-950 dark:text-blue-100">Content</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    All pages must be numbered consecutively. A manuscript would normally include a title, abstract, keywords, introduction, materials and methods, results and discussion, conclusions and references.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">i. Title page</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    A short title which should be concise but informative must be provided. This should be followed by the names and full addresses of all authors. E-mail addresses of the corresponding authors must be included.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">ii. Abstract</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    The abstract should not be more 220 words. It should give concise factual information about objectives of the work, the methods used, the results obtained and the conclusions reached.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">iii. Keywords</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    The authors should list below the abstract keywords for information retrieval purposes. The keywords should identify with main point in the paper.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">iv. Abbreviations and Notations</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Nomenclature must be listed at the beginning of the paper and should conform to the system of standard SI units. Acronyms and abbreviations should be spelt out in full at their first appearance in the text.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">v. Text</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Papers should be typed single column, with double line spacing on one side of the paper only with ample margins on all sides. The text should be divided into sections each with a separate heading, numbered consecutively. The section heading be typed on a separate line and should be bold.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">vi. Conclusions and Recommendations</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    The conclusions should summarise the findings, clearly stating the contributions and their relevance. Recommendations for implementation or for areas of further work on the subject matter should be made.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">vii. Acknowledgements</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    These should be brief and relevant. The names of funding organizations should be written in full. Dedications are not permitted.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">viii. References</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    References to publish work should be indicated at the appropriate place in the text, according to the Harvard system (i.e. using author(s)' name(s) and date), with a reference list in alphabetical order, at the end of the manuscript. All references in this list should be indicated at some point in the text and vice versa. Papers by more than two authors but with same first author should be listed by year sequence and alphabetically within each year. Examples of layout of reference are given below:
                  </p>

                  <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                    <div>
                      <p className="font-semibold text-blue-950 dark:text-blue-100">Book</p>
                      <p className="text-blue-700 dark:text-blue-300">Onyeyili, I.O. (2003) Analysis of statistically Determine Structures. El' Demak Publishers, Enugu.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-950 dark:text-blue-100">Thesis</p>
                      <p className="text-blue-700 dark:text-blue-300">Ihueze, C.C. (2005) Optimum Buckling Response Model of GRP Composites. Ph.D. Thesis, University of Nigeria, Nsukka.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-950 dark:text-blue-100">Journal</p>
                      <p className="text-blue-700 dark:text-blue-300">Umerie, S.C., Ogbuagu, A.S., Ogbuagu, J.O. (2004) Stabilisation of palm oils by using Ficus exasprata leaves in local processing methods. Bioresources Technology, 94: 307-310.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-950 dark:text-blue-100">Conference</p>
                      <p className="text-blue-700 dark:text-blue-300">Menkiti, M.C., Ugodulunwa, F.X.O., Onukwuli, O.D. (2007) studies on the coagulation and flocculation of coal washery effluent. Proceedings of the 37th annual conference of the Nigerian Society of Chemical Engineers, Enugu, 22-24 November, pp169-184.</p>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">ix. Illustrations</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    All figures whether line drawings, graphs or photographs should be given a figure number be Arabic numeral in ascending order as reference is first made to them in the text (e.g. Fig. 1). Tables are to be similarly numbered. Captions of figures should be below the respective figures while captions of table should be above the respective tables. The measured quantity with the units, usually in brackets, and the numerical scale should be given alongside the ordinate and abscissa of every graph. All illustrations including chemical structures should be placed in the appropriate places within the text.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">x. Submission of Manuscript</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Manuscript should be submitted to the Editor-in-Chief via pineditor2017@gmail.com.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">xi. Terms of Submission and Fees</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Manuscripts are considered for acceptance on the understanding that the work described is original and have not been published or submitted for consideration elsewhere and that the author has obtained necessary authorization for publication of the material submitted. Submission of a multi-authored manuscript implies the consent of all the participating authors. A processing fee of N5, 000.00 (FIve thousand naira only) is charged per manuscript. Make payment to PIN National Account, Polymer Institute of Nigeria account number 2011592024 at First Bank of Nigeria. A publication fee for accepted manuscript of NGN25,000.00 (Twenty five Thousand Naira) is charged and should be remitted to Polymer Institute of Nigerian Account number 2011592024 at First Bank of Nigeria.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">xii. Copyright</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    By submitting a manuscript, the authors agree that the copyright for the article is transferred to the Polymer Institute of Nigeria, if and when the article is accepted for publication.
                  </p>

                  <h4 className="text-base font-semibold text-blue-950 dark:text-blue-100 mt-4">xiii. Disposal of Material</h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    Once published, all copies of the manuscript and correspondence will be held for three months before disposal. Authors must contact the Technical secretary if they wish to have any material returned.
                  </p>
                </section>
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