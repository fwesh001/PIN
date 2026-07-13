import Link from 'next/link';
import { CrossIcon } from '@/components/Icons';

/**
 * Payment failure / error page.
 */
export default function CheckoutErrorPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <CrossIcon className="mx-auto h-16 w-16 text-red-600 dark:text-red-400" />
        <h1 className="mt-6 text-3xl font-bold text-blue-950 dark:text-blue-100">
          Payment Could Not Be Completed
        </h1>
        <p className="mt-3 text-blue-700 dark:text-blue-300">
          We were unable to confirm your payment. You have not been charged.
          Please try again or contact the editorial office.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/archive"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Back to Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
