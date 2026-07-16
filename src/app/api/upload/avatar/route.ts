import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/upload/avatar
 *
 * Local filesystem upload for profile pictures. Accepts a single `file`
 * field (image only, max 5MB), writes it to public/uploads/avatars, and
 * returns the public URL.
 */
export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

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
        { error: 'Only image files (.jpg, .png, .webp) are allowed.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Image exceeds the 5MB limit.' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json(
      { url: `/uploads/avatars/${filename}` },
      { status: 201 },
    );
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
