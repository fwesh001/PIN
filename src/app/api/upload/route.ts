import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * POST /api/upload
 *
 * Local filesystem upload for manuscript files (used for local testing).
 * Accepts multipart/form-data with a single `file` field, validates that
 * it is a PDF or Word document within the size limit, writes it to
 * public/uploads, and returns the public URL.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (
      !ALLOWED_EXTENSIONS.has(ext) ||
      (file.type && !ALLOWED_TYPES.has(file.type))
    ) {
      return NextResponse.json(
        { error: 'Only PDF or Word documents (.pdf, .doc, .docx) are allowed.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds the 20MB limit.' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
