import { NextRequest, NextResponse } from 'next/server';
import { searchSubmissions } from '@/lib/ojs/submissions';
import { getAllMockArticles } from '@/lib/mockData';
import type { NormalizedArticle } from '@/lib/ojs/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (!q) {
    return NextResponse.json({ articles: [] });
  }

  // Prefer the live OJS backend; fall back to local mock articles when it
  // is unreachable or misconfigured so search keeps working offline.
  try {
    const articles: NormalizedArticle[] = await searchSubmissions(q, 20);
    return NextResponse.json({ articles, source: 'ojs' });
  } catch {
    const query = q.toLowerCase();
    const articles = getAllMockArticles().filter((a) => {
      const authorText = a.authors
        .map((author) => `${author.name} ${author.affiliation ?? ''}`)
        .join(' ')
        .toLowerCase();
      return (
        a.title.toLowerCase().includes(query) ||
        a.abstract.toLowerCase().includes(query) ||
        a.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
        authorText.includes(query)
      );
    });
    return NextResponse.json({ articles, source: 'mock' });
  }
}