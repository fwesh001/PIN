import type { NormalizedArticle, NormalizedIssue } from '@/lib/ojs/types';

export const MOCK_ISSUE_PDF = '/uploads/a9367e15-9921-4360-badc-d3cafb7dabb8.pdf';

const ARTICLES_DIR = '/Articles';

const pdf = (filename: string): string => `${ARTICLES_DIR}/${filename}`;

export const mockIssue: NormalizedIssue = {
  id: '1',
  volume: 20,
  issueNumber: 1,
  year: 2025,
  title: 'Volume 20, Issue 1',
  datePublished: '2025-03-18',
  isCurrent: true,
};

export const mockArticles: NormalizedArticle[] = [
  {
    id: '301',
    title:
      'Assessment of Modified Leather Waste on Cure Characteristics of Natural Rubber Compound',
    abstract:
      'Leather waste (buffing) were sourced, cleaned and modified. The modification revealed improved filler characteristics for both treated leather waste (TLW) and carbonized leather waste (CLW) in terms of, bulk density, moisture content, lignin content, cellulose content, hemicelluloses content, thermal stability and FTIR respectively. The results obtained were compared with carbon black (CB) filled vulcanizates. The cure characteristics of the compounded rubber showed improved scorch time (TLW; 2.59 - 2.02 min, CLW; 2.05 - 1.61 min, CB; 1.78 - 1.19 min) and cure time (TLW; 6.04 - 5.56 min, CLW; 5.93 - 4.51 min, CB; 4.77 - 4.45 min) decreased with filler loading while the cure rate index (TLW; 1.27 - 1.53 min-1, CLW; 1.31 - 1.65 min-1, CB; 1.40 - 1.74 min-1), minimum torque (TLW; 4.10 - 5.08 kg-cm, CLW; 4.76 - 5.53 kg-cm, CB; 5.00 - 5.97 kg-cm) and maximum torque (TLW; 16.70 - 25.08 kg-cm, CLW; 19.44 - 26.19 kg-cm, CB; 20.04 - 27.95 kg-cm) increased with filler loadings from 10 phr - 50 phr. The research results showed that CLW and TLW can serve as alternative to CB for the production of polymer based articles such as shoe soles, floor-mats, oil seals, shock mounts etc. for some engineering applications.',
    keywords: ['Buffing', 'Crosslink', 'FTIR', 'Leather', 'Vulcanizate'],
    authors: [
      { name: 'Tenebe O. G', affiliation: 'Department of Polymer Technology, Nigerian Institute of Leather & Science Technology, Zaria' },
      { name: 'Ibeneme U', affiliation: 'Department of Polymer Technology, Nigerian Institute of Leather & Science Technology, Zaria' },
      { name: 'Ejiogu I. K', affiliation: 'Directorate of Research & Development, Nigerian Institute of Leather & Science Technology, Zaria' },
      { name: 'Bayero A. H', affiliation: 'Department of Polymer Technology, Nigerian Institute of Leather & Science Technology, Zaria' },
      { name: 'Uzochukwu M. I', affiliation: 'Department of Polymer Technology, Nigerian Institute of Leather & Science Technology, Zaria' },
    ],
    pdfUrl: pdf('Assessment of Modified Leather Waste on Cure Characteristics of Natural Rubber Compound.pdf'),
    datePublished: '2025-03-18',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 482,
  },
  {
    id: '302',
    title:
      'Comparative Study of Alkali and Silane Treated Sugarcane Bagasse for Mechanical Reinforcement in Epoxy Resin Nano Composites',
    abstract:
      'The nano composite of sugarcane bagasse and epoxy resin were prepared through the hand layup technique by using a glass mold. The fiber was initially treated with caustic soda and silane solution prior to the composite fabrication. Three different polymer composites (untreated, alkali, silane) at six different weight percentage of SCBP reinforcement (0wt%, 5wt%, 10wt%, 15wt%, 20wt%, 25wt%) were fabricated. Tensile, Flexural, Impact and Hardness tests were carried out. Both alkali and silane treated SCBP nano composite have better tensile strength than the untreated composite. The tensile strength and flexural modulus of all the composites decreases slightly as the fiber loading increases. The tensile modulus, flexural strength, impact, hardness of the fabricated composites was found to be increasing with increase in SCBP loading. With the exception of hardness test, the silane treated SCBP nano composites shows better properties than the alkali treated and the untreated SCBP nano composites for all the parameters.',
    keywords: ['Sugarcane Bagasse Powder', 'Alkali Treatment', 'Silane Treatment', 'Epoxy Resin'],
    authors: [
      { name: 'Umar Farouq Ahmad', affiliation: 'Department of Chemistry, Ahmadu Bello University, Zaria' },
      { name: 'Paul A. P. Mamza', affiliation: 'Department of Chemistry, Ahmadu Bello University, Zaria' },
      { name: 'M T Isah', affiliation: 'Department of Chemical Engineering, Ahmadu Bello University, Zaria' },
      { name: 'Nuhu Lawal', affiliation: 'Department of Polymer and Textile Engineering, Ahmadu Bello University, Zaria' },
    ],
    pdfUrl: pdf('Comparative Study of Alkali and Silane Treated Sugarcane Bagasse for Mechanical Reinforcement in Epoxy Resin Nano Composites.pdf'),
    datePublished: '2025-01-12',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 361,
  },
  {
    id: '303',
    title:
      'Recycling of Low-Density Polyethylene (Water Sachet) Film as Filler for the Production of Polyurethane in Cold Chain Supply Management',
    abstract:
      'The aim of this study is to investigate the potentials of incorporating recycled low-density polyethylene (PE) sachet water film as a sustainable filler in the manufacture of flexible polyurethane (PU) foam materials that could enhance cold chain management systems. Different formulations of PU foam were tested, focusing on the effects of PE on key mechanical properties. All formulations were mixed for 15 seconds, ensuring a consistent process, though cream time (13.6-17.2 seconds) and rise time (108-124 seconds) varied across compositions. The foam densities ranged from 21.64 to 26.44 kg/m³, with higher PE content generally increasing density and mechanical properties influenced by the PE content. Compression strength rose with higher PE but remained within the National Institute of Standards (NIS) limit of 10 kg/cm². However, flexural strength, tensile strength, force per unit area, and elongation decreased as PE content increased, indicating a trade-off between cost-efficiency and mechanical performance. Despite these changes, all formulations showed homogeneous morphology under Scanning Electron Microscopy, suggesting consistent material quality. The presented work indicates that PE can be efficiently introduced as a filler for flexible PU foams, hereby improving the foam performance, lowering production costs, and reducing the environmental impact of the indiscriminate disposal that is redirected by reusing these waste materials. However, higher PE percentages tend to lower the mechanical performance of the foam, indicating a need for optimized compositions.',
    keywords: ['Polyurethane Foam', 'Low Density Polyethylene (LDPE)', 'Water Sachet Film', 'Filler', 'Cold Chain'],
    authors: [
      { name: 'Awode Udukhomo Anthony', affiliation: 'Department of Chemistry, University of Jos' },
      { name: 'Mercy Akwum Olokpo', affiliation: 'Department of Chemistry, University of Jos' },
      { name: 'Edah Alexander Oba', affiliation: 'Department of Pharmaceutical Chemistry, University of Jos' },
    ],
    pdfUrl: pdf('Impact of Polymer Waste and Climate Mitigation; A Review.pdf'),
    datePublished: '2025-05-25',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 298,
  },
  {
    id: '304',
    title:
      'Production and Investigation of Physical and Tensile Properties of Waste Polyethylene - Baobab Fruit Shell Powder Composite',
    abstract:
      'In this study, the physical and tensile properties of the Waste polyethylene-baobab fruit shell composite were investigated. The highest and the lowest water absorption capacity of the samples were observed to be 12.24% at 30 wt% and 0.02% at 0 wt% respectively. The lowest density value (930 kgm-3) at 0 wt% BFS and the highest value (1110 kgm-3) at 30 wt% BFS. The tensile properties showed lowest value of tensile strength of 10.722 MPa at 0 wt% BFS and increased to highest value (13.827 MPa) at 15 wt% BFS, tensile modulus from 0.871 GPa at 15 wt% BFS to highest value of 1.448 GPa at 30 wt% BFS. Elongation at break were 15.153% at 15wt% BFS and 8.404% at 30wt% being the lowest and largest values respectively. The morphology and dispersion of the composites revealed poor filler dispersion.',
    keywords: ['Tensile properties', 'waste polyethylene', 'baobab fruit shell powder', 'composite'],
    authors: [
      { name: 'Mohammed Sani Yunusa', affiliation: 'Department of Mechanical Engineering, Bayero University Kano' },
      { name: 'Ibrahim Abdullahi', affiliation: 'Department of Mechanical Engineering, Bayero University Kano' },
      { name: 'Nuhu Lawal', affiliation: 'Department of Polymer and Textile Engineering, Ahmadu Bello University Zaria' },
      { name: 'Muhammad Tanko Baba', affiliation: 'Department of Mechanical Engineering, Federal Polytechnic Mubi, Adamawa State' },
    ],
    pdfUrl: pdf('Production and Investigation of Physical and Tensile Properties of Waste Polyethylene - Baobab Fruit Shell Powder Composite.pdf'),
    datePublished: '2025-02-12',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 574,
  },
];

export const mockFeaturedArticles: NormalizedArticle[] = mockArticles;

export const mockPublishedArticles: NormalizedArticle[] = mockArticles;

export function getAllMockArticles(): NormalizedArticle[] {
  return [...mockArticles];
}

export function getMockArticleById(id: string): NormalizedArticle | undefined {
  return getAllMockArticles().find((a) => a.id === id);
}