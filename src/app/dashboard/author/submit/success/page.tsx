import Link from 'next/link';
import { CheckCircleIcon } from '@/components/Icons';

export default function AuthorSubmitSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" />
      <h1 className="mt-6 text-3xl font-bold text-blue-950 dark:text-blue-100">
        Submission Received
      </h1>
      <p className="mt-3 text-blue-700 dark:text-blue-300">
        Thank you. Your manuscript has been received and is now under review by
        our editorial team. A confirmation email has been sent to your address.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/dashboard/author/manuscripts"
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          View My Manuscripts
        </Link>
        <Link
          href="/dashboard/author/submit"
          className="rounded-lg border border-blue-300 px-5 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
        >
          Submit Another
        </Link>
      </div>
    </div>
  );
}
