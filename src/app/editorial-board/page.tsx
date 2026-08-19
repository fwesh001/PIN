import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const EDITOR_IN_CHIEF = {
  name: 'Magaji Ladan, PhD.',
  title: 'Editor-in-Chief',
  image: '/avatar-placeholder.png',
};

const BOARD_MEMBERS = [
  {
    name: 'Shehu Habibu, PhD.',
    title: 'Technical Secretary, Editorial Board',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Peter O. Nkeonye',
    title: 'Associate Editor',
    affiliation: 'Department of Textile Science and Technology, A.B.U., Zaria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Stephen S. Ochigbo',
    title: 'Associate Editor',
    affiliation: 'Department of Chemistry, FUT, Minna, Niger State',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Issac O. Igwe',
    title: 'Associate Editor',
    affiliation: 'Department of Polymer and Textile Engineering, FUT Owerri, Imo State',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Shehu Umar',
    title: 'Associate Editor',
    affiliation: 'Department of Metallurgical and Materials Engineering, A.B.U., Zaria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Dr. Amali Ejila',
    title: 'Associate Editor',
    affiliation: 'Nigerian Institute of Leather and Science Technology (NILEST), Zaria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Dr. Clement Gonah',
    title: 'Associate Editor',
    affiliation: 'Glass Technology Unit, Department of Industrial Design, A.B.U., Zaria',
    image: '/avatar-placeholder.png',
  },
  {
    name: 'Prof. Peter S. Dass',
    title: 'Associate Editor',
    affiliation: 'Department of Chemistry, Modibbo Adama University of Technology, Yola',
    image: '/avatar-placeholder.png',
  },
];

export default function EditorialBoardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-blue-950 transition-colors">
      <Navigation />

      {/* Hero Header */}
      <section className="w-full bg-blue-50 dark:bg-blue-950/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      >
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
            </div>
          </div>
        </section>

        {/* Board Members Section */}
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 dark:text-blue-100 border-b border-blue-100 dark:border-blue-850 pb-3">
            Technical Secretary &amp; Associate Editors
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