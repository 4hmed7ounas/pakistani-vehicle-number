/**
 * Pattern matching the Punjab Universal Numbering Scheme:
 * Exactly 3 letters, optional single space or hyphen separator, exactly 3 digits.
 * Case-insensitive.
 */
export const PUNJAB_VEHICLE_NUMBER_PATTERN: RegExp = /^[A-Za-z]{3}[ -]?[0-9]{3}$/;

/**
 * Internal parsing pattern with capture groups for letters and numeric digits.
 */
const PUNJAB_PARSE_PATTERN = /^([A-Za-z]{3})[ -]?([0-9]{3})$/;

/**
 * Represents a parsed and validated Punjab vehicle registration number.
 */
export interface PunjabVehicleNumber {
  province: "punjab";
  format: "universal";
  letters: string;
  number: string;
  normalized: string;
}

/**
 * Structurally parses a Punjab vehicle registration number.
 *
 * Checks if the input conforms to the Punjab Universal Numbering Scheme
 * (3 letters + 3 digits, case-insensitive, optional space or hyphen separator).
 *
 * NOTE: This performs structural validation only. It does not verify whether
 * the registration number exists in the Punjab Excise & Taxation / MTMIS database.
 *
 * @param value The raw registration string to parse
 * @returns Parsed vehicle number object or null if input is invalid
 */
export function parsePunjabVehicleNumber(
  value: string
): PunjabVehicleNumber | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const match = trimmed.match(PUNJAB_PARSE_PATTERN);

  if (!match || !match[1] || !match[2]) {
    return null;
  }

  const letters = match[1].toUpperCase();
  const number = match[2];

  return {
    province: "punjab",
    format: "universal",
    letters,
    number,
    normalized: `${letters}-${number}`,
  };
}

/**
 * Checks whether the given value structurally conforms to the Punjab
 * Universal Numbering Scheme (e.g., "ABC 123", "ABC-123", "ABC123").
 *
 * This function never throws for arbitrary inputs and returns false for
 * any non-string or structurally invalid values.
 *
 * @param value Any value to check
 * @returns True if value is a valid Punjab vehicle number, false otherwise
 */
export function isPunjabVehicleNumber(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return PUNJAB_VEHICLE_NUMBER_PATTERN.test(value.trim());
}

/**
 * Formats and normalizes a Punjab vehicle registration number into "ABC-123".
 *
 * Converts letters to uppercase, strips accidental extra whitespace, and formats
 * with a standardized hyphen separator.
 *
 * @param value The vehicle registration number string (e.g., "abc123", "ABC 123", "ABC-123")
 * @returns Normalized registration string (e.g., "ABC-123")
 * @throws {TypeError} If value is not a string
 * @throws {Error} If value does not structurally conform to the Punjab Universal Scheme
 */
export function formatPunjabVehicleNumber(value: string): string {
  if (typeof value !== "string") {
    throw new TypeError(
      `Expected a string for vehicle registration number, received ${typeof value}`
    );
  }

  const parsed = parsePunjabVehicleNumber(value);

  if (!parsed) {
    throw new Error(
      `Invalid Punjab vehicle registration number: ${JSON.stringify(value)}. Expected format: 3 letters followed by 3 digits (e.g. ABC 123, ABC-123, or ABC123).`
    );
  }

  return parsed.normalized;
}
