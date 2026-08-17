'use client';

import { useParams } from 'next/navigation';
import { getMockArticleById, MOCK_ISSUE_PDF } from '@/lib/mockData';
import PdfViewer from '@/components/PdfViewer';

export default function ViewerPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Handle special case: current-issue opens the featured issue PDF
  if (id === 'current-issue') {
    return <PdfViewer fileUrl={MOCK_ISSUE_PDF} title="Current Issue — Volume 15, Issue 2" />;
  }
  
  const article = getMockArticleById(id);

  if (!article) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-50 dark:bg-blue-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">Article not found</h1>
          <p className="mt-2 text-blue-600 dark:text-blue-400">The requested article could not be found. Please check the ID and try again.</p>
        </div>
      </div>
    );
  }

  return <PdfViewer fileUrl={article.pdfUrl} title={article.title} />;
}