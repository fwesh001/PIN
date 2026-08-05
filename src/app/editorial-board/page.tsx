import Link from 'next/link';
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

const OJS_URL = process.env.NEXT_PUBLIC_OJS_URL ?? 'https://pinjournal.org';

const EDITOR_IN_CHIEF = {
  name: 'Prof. Michael A. Omoighe',
  title: 'Editor-in-Chief',
  affiliation: 'Department of Polymer Chemistry, Federal University of Technology, Owerri, Nigeria',
  email: 'm.omoighe@polymerinstitute.org.ng',
  image: '/avatar-placeholder.png',
  bio: 'Specialist in Advanced Polymer Composites and Thermosetting Resins with over 25 years of research and academic excellence.',
};

const BOARD_MEMBERS = [
  {
    name: 'Prof. Elizabeth Ngozi',
    title: 'Associate Editor (Physical Chemistry)',
    affiliation: 'Department of Chemistry, University of Ibadan, Nigeria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Dr. Ibrahim Babangida',
    title: 'Technical Reviewer (Polymer Processing)',
    affiliation: 'Department of Chemical Engineering, Ahmadu Bello University, Zaria, Nigeria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Chukwudi K. Alao',
    title: 'Editorial Board Member (Nanomaterials)',
    affiliation: 'Department of Pure and Industrial Chemistry, University of Nigeria, Nsukka, Nigeria',
    image: '/avatar-placeholder.png',
  },
  {
    name: "Dr. Fatima Yar'Adua",
    title: 'Associate Editor (Biopolymers & Biomaterials)',
    affiliation: 'Department of Chemistry, Bayero University Kano, Nigeria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Olufemi Adebayo',
    title: 'Technical Reviewer (Polymer Blends & Composites)',
    affiliation: 'Department of Chemistry, University of Lagos, Nigeria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Dr. Amara Eke',
    title: 'Editorial Board Member (Industrial Chemistry)',
    affiliation: 'Department of Industrial Chemistry, Nnamdi Azikiwe University, Awka, Nigeria',
    image: '/avatar-placeholder.png',
  },
];

export default function EditorialBoardPage() {
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
            Editorial Board
          </h1>
          <p className="text-base sm:text-lg text-blue-800/80 dark:text-blue-300/80 max-w-2xl mx-auto leading-relaxed">
            The scholarly leadership of the Nigerian Journal of Polymer Science and Technology (NJPST), upholding research rigor, scientific ethics, and peer-review integrity.
          </p>
        </div>
      </section>

      {/* Board Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full space-y-16">
        
        {/* Editor-in-Chief Section */}
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
            Editor-in-Chief
          </h2>
          
          <div className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 shrink-0">
              <img 
                src={EDITOR_IN_CHIEF.image} 
                alt={EDITOR_IN_CHIEF.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-950 dark:text-blue-100">
                  {EDITOR_IN_CHIEF.name}
                </h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
                  {EDITOR_IN_CHIEF.title}
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium">{EDITOR_IN_CHIEF.affiliation}</p>
                <p className="italic text-blue-600/80 dark:text-blue-400/80">{EDITOR_IN_CHIEF.bio}</p>
              </div>
              
              <div className="pt-2">
                <a 
                  href={`mailto:${EDITOR_IN_CHIEF.email}`} 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ✉ Contact Editor
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Board Members Section */}
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
            Editorial Board Members
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOARD_MEMBERS.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 mb-4 shrink-0">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-blue-950 dark:text-blue-100 leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wide">
                      {member.title}
                    </p>
                  </div>
                  
                  <p className="text-xs text-blue-800 dark:text-blue-300 mt-3 font-medium line-clamp-2">
                    {member.affiliation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}