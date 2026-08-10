import type { NormalizedArticle, NormalizedIssue } from '@/lib/ojs/types';

export const MOCK_ISSUE_PDF = '/uploads/a9367e15-9921-4360-badc-d3cafb7dabb8.pdf';
export const MOCK_ARTICLE_PDF = '/uploads/b5d87bb0-3dd6-4f22-99fa-f54a33c09f1e.pdf';

export const mockIssue: NormalizedIssue = {
  id: '1',
  volume: 15,
  issueNumber: 2,
  year: 2026,
  title: 'Volume 15, Issue 2',
  datePublished: '2026-03-15',
  isCurrent: true,
};

export const mockFeaturedArticles: NormalizedArticle[] = [
  {
    id: '101',
    title:
      'Effect of Cellulose Nanocrystal Loading on the Mechanical Properties of Poly(lactic acid) Biocomposites',
    abstract: '',
    keywords: ['polylactic acid', 'cellulose nanocrystals', 'biocomposites'],
    authors: [{ name: 'Adewale O. Bakare', affiliation: 'Federal University of Technology, Akure' }],
    pdfUrl: MOCK_ARTICLE_PDF,
    datePublished: '2026-03-15',
    volume: 15,
    issueNumber: 2,
    year: 2026,
    views: 482,
  },
  {
    id: '102',
    title:
      'Optimisation of Natural Rubber Vulcanisation Using Response Surface Methodology',
    abstract: '',
    keywords: ['natural rubber', 'vulcanisation', 'RSM'],
    authors: [{ name: 'Chinwe N. Okafor', affiliation: 'University of Nigeria, Nsukka' }],
    pdfUrl: MOCK_ARTICLE_PDF,
    datePublished: '2026-03-15',
    volume: 15,
    issueNumber: 2,
    year: 2026,
    views: 361,
  },
  {
    id: '103',
    title:
      'Recycled Polyethylene Terephthalate (PET) Fibre Reinforcement of Concrete: A Review',
    abstract: '',
    keywords: ['PET', 'waste recycling', 'concrete', 'polymer composites'],
    authors: [{ name: 'Ibrahim S. Yusuf', affiliation: 'Ahmadu Bello University, Zaria' }],
    pdfUrl: MOCK_ARTICLE_PDF,
    datePublished: '2026-03-15',
    volume: 15,
    issueNumber: 2,
    year: 2026,
    views: 298,
  },
];

export const mockPublishedArticles: NormalizedArticle[] = [
  {
    id: '201',
    title:
      'Enhancing the Thermal Stability of Low-Density Polyethylene with Zinc–Palm Kernel Ash Hybrid Fillers',
    abstract: '',
    keywords: ['LDPE', 'palm kernel ash', 'thermal stability', 'composites'],
    authors: [{ name: 'Margaret E. Effiong', affiliation: 'University of Uyo' }],
    pdfUrl: MOCK_ARTICLE_PDF,
    datePublished: '2026-02-10',
    volume: 15,
    issueNumber: 1,
    year: 2026,
    views: 574,
  },
  {
    id: '202',
    title:
      'Synthesis and Characterisation of Epoxidised Soybean Oil–Based Epoxy Resins',
    abstract: '',
    keywords: ['epoxidation', 'soybean oil', 'epoxy resin'],
    authors: [{ name: 'Saidu B. Abdullahi', affiliation: 'Bayero University, Kano' }],
    pdfUrl: MOCK_ARTICLE_PDF,
    datePublished: '2026-01-22',
    volume: 15,
    issueNumber: 1,
    year: 2026,
    views: 410,
  },
  {
    id: '203',
    title:
      'Water Absorption Kinetics of Banana-Fibre-Reinforced Recycled HDPE Composites',
    abstract: '',
    keywords: ['banana fibre', 'HDPE', 'water absorption', 'composites'],
    authors: [{ name: 'Ngozi P. Eze', affiliation: 'Nnamdi Azikiwe University, Awka' }],
    pdfUrl: MOCK_ARTICLE_PDF,
    datePublished: '2025-12-05',
    volume: 15,
    issueNumber: 1,
    year: 2025,
    views: 333,
  },
];

export function getAllMockArticles(): NormalizedArticle[] {
  return [...mockFeaturedArticles, ...mockPublishedArticles];
}

export function getMockArticleById(id: string): NormalizedArticle | undefined {
  return getAllMockArticles().find((a) => a.id === id);
}