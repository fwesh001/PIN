import "dotenv/config";
import { PrismaClient, Role, ArticleStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean out existing tables to prevent duplicate key constraint errors
  // Note: We delete in reverse order of relationships to respect foreign key constraints
  await prisma.apcToken.deleteMany({});
  await prisma.reviewAssignment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.issue.deleteMany({});
  
  console.log('🧹 Cleaned existing database rows.');

  // 2. Create Initial Core Users
  const defaultPasswordHash = await bcrypt.hash('test-password-123', 10);

  const editor = await prisma.user.create({
    data: {
      email: 'zabdielfwesh001@gmail.com',
      name: 'Dev. ANYAOGU .C. ZABDEIL',
      role: Role.EDITOR,
      affiliation: 'National open universtiy of nigeria',
      passwordHash: defaultPasswordHash,
    },
  });

  const author = await prisma.user.create({
    data: {
      email: 'author.test@university.edu',
      name: 'Dr. Fatima Umar',
      role: Role.AUTHOR,
      affiliation: 'Ahmadu Bello University',
      country: 'Nigeria',
      passwordHash: defaultPasswordHash,
    },
  });

  const reviewer1 = await prisma.user.create({
    data: {
      email: 'reviewer1@academic.net',
      name: 'Prof. John Doe',
      role: Role.REVIEWER,
      affiliation: 'University of Ibadan',
      country: 'Nigeria',
      passwordHash: defaultPasswordHash,
    },
  });

  console.log('👤 Created system user seeds (Editor, Author, Reviewer).');

  // 3. Create a Draft Journal Issue
  const issue = await prisma.issue.create({
    data: {
      volume: 1,
      issueNumber: 1,
      status: 'DRAFT',
    },
  });

  console.log('📚 Created initial Journal Volume 1, Issue 1 (Draft).');

  // 4. Seed pre-approved APC (Article Processing Charge) Waiver Tokens
  await prisma.apcToken.createMany({
    data: [
      { tokenCode: 'NJPST-WAIVER-2026-XYZ', isRedeemed: false },
      { tokenCode: 'PIN-POLYMER-FREE-99', isRedeemed: false },
      { tokenCode: 'BUK-CHEMISTRY-DEPT', isRedeemed: false },
    ],
  });

  console.log('🎟️ Seeded 3 active Article Processing Charge (APC) tokens.');

  // 5. Create a Sample Under-Review Manuscript linked to our Author
  await prisma.article.create({
    data: {
      title: 'Synthesis and Characterization of Novel Polymer Nanocomposites for Water Purification',
      abstract: 'This research outlines a highly efficient structural method for processing polymer-based nanocomposites aimed at removing heavy metallic particles from regional industrial water frameworks...',
      keywords: ['Polymer Science', 'Nanocomposites', 'Water Treatment', 'Green Chemistry'],
      pdfUrl: 'https://example.com/mock-manuscript-upload.pdf',
      status: ArticleStatus.UNDER_REVIEW,
      authorId: author.id,
    },
  });

  console.log('📄 Created baseline manuscript entry ("Synthesis and Characterization...").');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });