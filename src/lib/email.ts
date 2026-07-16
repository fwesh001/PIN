/**
 * Email helper — log-only stub.
 *
 * Real SMTP/Resend integration is deferred to a later phase. For now
 * every notification is logged server-side so the call sites are wired
 * and can be upgraded without touching the UI or API handlers.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  // TODO(phase-4.6): Replace with Resend / Nodemailer once
  // RESEND_API_KEY (or SMTP credentials) are configured in .env.
  console.info(
    `[email:stub] To: ${message.to} | Subject: ${message.subject}\n${message.body}`,
  );
}

export async function sendSubmissionConfirmation(
  to: string,
  authorName: string,
  articleTitle: string,
): Promise<void> {
  await sendEmail({
    to,
    subject: 'NJPST — Manuscript Submission Received',
    body: `Dear ${authorName},\n\nThank you for submitting "${articleTitle}" to the Nigerian Journal of Polymer Science and Technology. Your manuscript is now under review by our editorial team.\n\nYou will be notified when a decision is made.\n\n— NJPST Editorial Office`,
  });
}
