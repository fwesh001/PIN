'use client';

import { useParams } from 'next/navigation';
import { getMockArticleById } from '@/lib/mockData';
import PdfViewer from '@/components/PdfViewer';

export default function ViewerPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const article = getMockArticleById(id);

  if (!article) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-50 dark:bg-blue-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">Article not found</h1>
          <p className="mt-2 text-blue-600 dark:text-blue-400">The requested article could not be found.</p>
        </div>
      </div>
    );
  }

  return <PdfViewer fileUrl={article.pdfUrl} title={article.title} />;
}