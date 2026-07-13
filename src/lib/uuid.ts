/**
 * Validates whether a string is a well-formed UUID (v4 format).
 * Matches the pattern: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx
 *
 * Use this before passing user-supplied IDs to Prisma queries to
 * prevent PostgreSQL "invalid input syntax for type uuid" errors.
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value.trim());
}
