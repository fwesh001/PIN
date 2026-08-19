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
  {
    id: '305',
    title:
      'Studies on Some Properties of Snail Shell and Cassava Peel Powdered Polypropylene Composites',
    abstract:
      'This study investigated some properties of snail and cassava peel-filled polypropylene composites. The snail shell and cassava peel powders of particle sizes (90µm) were incorporated into the polymer polypropylene matrix in a ratio of 14:3:3, 15:3:2 and 16:3:1 for polypropylene/snail shell/cassava peel; 17:3, 18:2 and 19:1 for polypropylene/cassava peel and 17:3, 18:2, 19:1 for polypropylene/snail shell powdered composites. The mixtures were prepared using injection molding machines at a hopper temperature of 200°C and at a rotor speed of 60rpm and at an average thickness of 3.00mm in accordance with American Society of Testing and Materials Standard, to determine the mechanical properties of the composite. The rates of bio-degradation and water absorption of the composites were also investigated for 120 days and 42 days respectively. Results showed that the tensile properties, the flexural properties as well as impact strength of the composite decreased with reference to the same properties of the neat polypropylene. However, the tensile properties, flexural properties and impact strength to these composites increased with increasing filler content loading. Again, from the results, the rate of bio-degradation and water absorption increased with increasing filler content loading. The results showed that the incorporation of cassava peel and snail shell powders into polypropylene matrix decreased the mechanical properties of the composite while the rate of bio-degradation and water absorption increased with time.',
    keywords: ['Polypropylene', 'Biodegradation', 'Snail', 'Cassava', 'Composite', 'Absorption'],
    authors: [
      { name: 'Oriji O. G', affiliation: 'Department of Pure & Industrial Chemistry, University of Port Harcourt' },
      { name: 'Ochia C. A', affiliation: 'Department of Pure & Industrial Chemistry, University of Port Harcourt' },
    ],
    pdfUrl: pdf('Studies on Some Properties of Snail Shell and Cassava Peel Powdered Polypropylene Composites.pdf'),
    datePublished: '2025-02-18',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 410,
  },
  {
    id: '306',
    title:
      'The Morphological, Thermal and Mechanical Properties of Ground Rubber Tire (GRT) Filled Waste High-Density Polyethylene (rHDPE)',
    abstract:
      'This research investigates the morphological, thermal and mechanical properties of ground rubber tire (GRT) filled waste high-density polyethylene (rHDPE), showing the effect of variable particle sizes. In the adopted methodology, the samples were prepared through melt mixing (using two-roll mill machine), tailed by compression molding, different blends of variable particle sizes were prepared (150 µm, 212 µm, 300 µm and 425 µm) and a control sample of 150g rHDPE was also prepared. The morphology, thermal properties and mechanical properties of the developed composites are analyzed using Scanning electron microscopy (SEM), Dynamic Mechanical Analysis (DMA), tensile and flexural tests respectively. The SEM result shows some inhomogeneity and poor dispersion of the GTR filler which attributed to improper stress transfer along the interface and formation of cracks in the developed polymer composited, causing reduction in mechanical strength. A more homogenous morphology with reduced defects was observed upon increasing the filler content from 150µm to 212µm, leading to an improved interfacial adhesion with the HDPE matrix. Further increase (from 212µm to 300µm) gave more homogenous micrograph but addition of GTR particles up 425µm led to rough surface. For thermal behavior, as the different sizes of the GRT filler were introduced into the HDPE matrix, the storage modulus decreases, attributed to the material softening caused by the soft rubber particles which result in lower rigidity except for sample made with 150 µm. Incorporation of 300 µm particles of GTR results in higher rigidity, which similarly gave more homogenous micrograph with uniform dispersion. The result also shows that, increasing the GTR particles causes decline in the flexural stress and modulus, having similar trend with the tensile modulus. The elongation at break also shows a decline with addition of the different particle sizes of the filler, with the exception of sample 300µm.',
    keywords: [
      'Morphological',
      'Ground Rubber Tire (GRT)',
      'Waste High-Density Polyethylene (rHDPE)',
      'Scanning Electron Microscopy (SEM)',
      'Dynamic Mechanical Analysis (DMA)',
    ],
    authors: [
      { name: 'Abdulkadir S. A', affiliation: 'Department of Polymer and Textile Engineering, Ahmadu Bello University, Zaria' },
      { name: 'Zakari Y. I', affiliation: 'Department of Chemistry, Ahmadu Bello University, Zaria' },
      { name: 'Clifford O. B', affiliation: 'Department of Pure and Industrial Chemistry, Prince Abubakar Audu University Anyigba, Kogi State' },
      { name: 'Mohammed I. A', affiliation: 'Department of Polymer and Textile Engineering, Ahmadu Bello University, Zaria' },
      { name: 'Yusuf O. L', affiliation: 'Department of Polymer and Textile Engineering, Ahmadu Bello University, Zaria' },
      { name: 'Ojobo L. O', affiliation: 'Department of Polymer and Textile Engineering, Ahmadu Bello University, Zaria' },
    ],
    pdfUrl: pdf('The Morphological, Thermal and Mechanical Properties of Ground Rubber Tire (GRT) Filled Waste High-Density Polyethylene (rHDPE).pdf'),
    datePublished: '2025-01-18',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 333,
  },
  {
    id: '307',
    title:
      'The Study of Polylactic Acid and Nanoclay on the Degradation Properties of Low-Density Polyethylene Composites',
    abstract:
      'A study was carried out to check the effect of using polylactic acid, Nano clay and glycerine as compatibilizer on the degradation property of virgin and waste low density Polyethylene which is the major component used in producing polyethylene bag. Virgin and waste samples of polyethylene, polylactic acid and Nano clay were obtained locally and compounded using the two-roll mix and the compression moulding machine to produce the composites. Moulded samples produced were cut accordingly using ASTM specification for the tests. Tests carried out included tensile, flexural, hardness, impact, water absorption, soil burial test. Results showed improved tensile, flexural, hardness strength as compared to the control sample (100% Virgin Polyethylene). The addition of polylactic acid, Nano clay and glycerine showed good interfacial bonding between the matrix and the fillers which improved the mechanical properties, water absorption and aided degradation during soil burial test. As the amount of filler content increased it affected the impact test due to the brittle nature of both Nano clay and polylactic acid.',
    keywords: ['Low density polyethylene', 'Nano clay', 'polylactic acid', 'glycerine', 'degradation', 'physio-mechanical properties'],
    authors: [
      { name: 'I. A. Dina', affiliation: 'Department of Textile and Polymer Technology, Kaduna Polytechnic' },
      { name: 'C. E. Gimba', affiliation: 'Department of Chemistry, Ahmadu Bello University, Zaria' },
      { name: 'A. I. Okele', affiliation: 'Department of Polymer, Nigerian Institute of Leather & Science Technology (NILEST)' },
    ],
    pdfUrl: pdf('The Study of Polylactic Acid and Nanoclay on the Degradation Properties of Low-Density Polyethylene Composites.pdf'),
    datePublished: '2025-02-10',
    volume: 20,
    issueNumber: 1,
    year: 2025,
    views: 247,
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