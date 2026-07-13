/**
 * Paystack payment gateway helper.
 *
 * Uses native `fetch` (no SDK dependency) to initialize and verify
 * transactions. All amounts are expressed in the currency's smallest
 * subunit (kobo for NGN, cents for USD) as required by Paystack.
 *
 * Required environment variables:
 *   - PAYSTACK_SECRET_KEY  (server-side only)
 *   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY (client-side inline widget, optional)
 */

const PAYSTACK_BASE = 'https://api.paystack.co';

export interface PaystackInitializeArgs {
  email: string;
  /** Amount in the currency's smallest subunit (kobo / cents). */
  amount: number;
  currency: 'NGN' | 'USD';
  reference?: string;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}

export interface PaystackInitializeResult {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

export interface PaystackVerifyResult {
  status: 'success' | 'failed' | 'abandoned' | string;
  reference: string;
  amount: number;
  currency: string;
  metadata: Record<string, unknown>;
  customerEmail: string;
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not configured. Add it to your environment to enable payments.',
    );
  }
  return key;
}

/** Initialize a transaction and return the hosted-checkout URL. */
export async function initializeTransaction(
  args: PaystackInitializeArgs,
): Promise<PaystackInitializeResult> {
  const key = secretKey();

  const body: Record<string, unknown> = {
    email: args.email,
    amount: args.amount,
    currency: args.currency,
    metadata: args.metadata ?? {},
  };
  if (args.reference) body.reference = args.reference;
  if (args.callbackUrl) body.callback_url = args.callbackUrl;

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: {
      authorization_url: string;
      reference: string;
      access_code: string;
    };
  };

  if (!res.ok || !json.status || !json.data) {
    throw new Error(json.message || 'Paystack initialization failed.');
  }

  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference,
    accessCode: json.data.access_code,
  };
}

/** Verify a transaction by its reference. */
export async function verifyTransaction(
  reference: string,
): Promise<PaystackVerifyResult> {
  const key = secretKey();

  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
      },
    },
  );

  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: {
      status: string;
      reference: string;
      amount: number;
      currency: string;
      metadata: Record<string, unknown>;
      customer: { email: string };
    };
  };

  if (!res.ok || !json.status || !json.data) {
    throw new Error(json.message || 'Paystack verification failed.');
  }

  return {
    status: json.data.status,
    reference: json.data.reference,
    amount: json.data.amount,
    currency: json.data.currency,
    metadata: json.data.metadata ?? {},
    customerEmail: json.data.customer.email,
  };
}
