import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isValidUuid } from '@/lib/uuid';
import { FileIcon, ChevronLeftIcon } from '@/components/Icons';
import CheckoutClient from '@/components/CheckoutClient';

interface CheckoutPageProps {
  params: Promise<{ articleId: string }>;
}

/**
 * APC Checkout page (Server Component).
 *
 * Loads the article + author, then renders the interactive
 * CheckoutClient which handles Paystack initialization.
 */
export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { articleId } = await params;

  if (!isValidUuid(articleId)) {
    notFound();
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <a
          href="/archive"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors hover:text-blue-900 dark:hover:text-blue-100"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Archive
        </a>

        <div className="mt-6 flex items-center gap-3">
          <FileIcon className="h-7 w-7 text-blue-700 dark:text-blue-300" />
          <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-100">
            Complete Your Submission
          </h1>
        </div>

        <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
          Settle the Article Processing Charge (APC) to publish your manuscript
          in the Nigerian Journal of Polymer Science and Technology.
        </p>

        <div className="mt-8">
          <CheckoutClient
            articleId={article.id}
            articleTitle={article.title}
            authorEmail={article.author.email}
            authorName={article.author.name ?? ''}
          />
        </div>
      </div>
    </div>
  );
}
