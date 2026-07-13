import Link from 'next/link';
import { CheckCircleIcon } from '@/components/Icons';

/**
 * Post-payment confirmation page.
 */
export default function SubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" />
        <h1 className="mt-6 text-3xl font-bold text-blue-950 dark:text-blue-100">
          Payment Successful
        </h1>
        <p className="mt-3 text-blue-700 dark:text-blue-300">
          Your Article Processing Charge has been settled. Our editorial team
          will finalize the publication of your manuscript shortly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/archive"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Browse the Archive
          </Link>
          <Link
            href="/dashboard/author/submit"
            className="rounded-lg border border-blue-300 px-5 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
          >
            Submit Another
          </Link>
        </div>
      </div>
    </div>
  );
}
