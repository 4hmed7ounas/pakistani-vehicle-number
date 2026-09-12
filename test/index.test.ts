import { describe, it, expect } from "vitest";
import {
  PUNJAB_VEHICLE_NUMBER_PATTERN,
  isPunjabVehicleNumber,
  parsePunjabVehicleNumber,
  formatPunjabVehicleNumber,
  type PunjabVehicleNumber,
} from "../src/index.js";

describe("PUNJAB_VEHICLE_NUMBER_PATTERN", () => {
  it("should be an instance of RegExp", () => {
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN).toBeInstanceOf(RegExp);
  });

  it("should not have global flag to avoid stateful lastIndex issues", () => {
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.global).toBe(false);
  });

  it("should match valid formats directly", () => {
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test("ABC123")).toBe(true);
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test("ABC 123")).toBe(true);
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test("ABC-123")).toBe(true);
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test("abc123")).toBe(true);
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test("abc-123")).toBe(true);
  });
});

describe("isPunjabVehicleNumber", () => {
  describe("valid inputs", () => {
    const validCases = [
      "ABC123",
      "ABC 123",
      "ABC-123",
      "abc123",
      "abc-123",
      "abc 123",
      "LEA123",
      "LEA 456",
      "LEA-789",
      "xyz001",
      "AbC 123",
      "aBc-999",
      "  ABC 123  ",
      "  abc-123\n",
    ];

    validCases.forEach((input) => {
      it(`should return true for valid registration: ${JSON.stringify(input)}`, () => {
        expect(isPunjabVehicleNumber(input)).toBe(true);
      });
    });
  });

  describe("invalid inputs", () => {
    const invalidCases = [
      // Letter count mismatch
      "AB123",
      "A 123",
      "ABCD123",
      "ABCDE 123",
      // Digit count mismatch
      "ABC12",
      "ABC 1",
      "ABC-12",
      "ABC1234",
      "ABC-1234",
      "ABC 12345",
      // Inverted order
      "123ABC",
      "123-ABC",
      "123 ABC",
      // Invalid separators
      "ABC  123",
      "ABC--123",
      "ABC_123",
      "ABC/123",
      "ABC.123",
      "ABC - 123",
      "ABC -123",
      "ABC- 123",
      // Invalid characters
      "AB! 123",
      "ABC 12A",
      "1BC 123",
      "AB1 123",
      // Empty and whitespace only
      "",
      " ",
      "   ",
      "\t\n",
    ];

    invalidCases.forEach((input) => {
      it(`should return false for invalid registration: ${JSON.stringify(input)}`, () => {
        expect(isPunjabVehicleNumber(input)).toBe(false);
      });
    });
  });

  describe("non-string values", () => {
    const nonStringCases = [
      null,
      undefined,
      123,
      0,
      NaN,
      true,
      false,
      {},
      { registration: "ABC 123" },
      [],
      ["ABC 123"],
      () => "ABC 123",
      Symbol("ABC 123"),
    ];

    nonStringCases.forEach((input) => {
      it(`should return false without throwing for non-string: ${String(input)}`, () => {
        expect(isPunjabVehicleNumber(input)).toBe(false);
      });
    });
  });
});

describe("parsePunjabVehicleNumber", () => {
  it("should correctly parse valid Punjab universal registration numbers", () => {
    const expected: PunjabVehicleNumber = {
      province: "punjab",
      format: "universal",
      letters: "ABC",
      number: "123",
      normalized: "ABC-123",
    };

    expect(parsePunjabVehicleNumber("ABC123")).toEqual(expected);
    expect(parsePunjabVehicleNumber("ABC 123")).toEqual(expected);
    expect(parsePunjabVehicleNumber("ABC-123")).toEqual(expected);
  });

  it("should convert lowercase letters to uppercase in parsed result", () => {
    const parsed = parsePunjabVehicleNumber("lea 456");
    expect(parsed).toEqual({
      province: "punjab",
      format: "universal",
      letters: "LEA",
      number: "456",
      normalized: "LEA-456",
    });
  });

  it("should handle leading and trailing whitespace", () => {
    const parsed = parsePunjabVehicleNumber("  xyz-789  ");
    expect(parsed).toEqual({
      province: "punjab",
      format: "universal",
      letters: "XYZ",
      number: "789",
      normalized: "XYZ-789",
    });
  });

  it("should return null for invalid inputs", () => {
    expect(parsePunjabVehicleNumber("AB123")).toBeNull();
    expect(parsePunjabVehicleNumber("ABCD123")).toBeNull();
    expect(parsePunjabVehicleNumber("ABC12")).toBeNull();
    expect(parsePunjabVehicleNumber("ABC1234")).toBeNull();
    expect(parsePunjabVehicleNumber("123ABC")).toBeNull();
    expect(parsePunjabVehicleNumber("ABC_123")).toBeNull();
    expect(parsePunjabVehicleNumber("")).toBeNull();
    expect(parsePunjabVehicleNumber("   ")).toBeNull();
  });

  it("should return null for non-string values safely at runtime", () => {
    // @ts-expect-error Testing runtime resilience
    expect(parsePunjabVehicleNumber(null)).toBeNull();
    // @ts-expect-error Testing runtime resilience
    expect(parsePunjabVehicleNumber(undefined)).toBeNull();
    // @ts-expect-error Testing runtime resilience
    expect(parsePunjabVehicleNumber(123456)).toBeNull();
    // @ts-expect-error Testing runtime resilience
    expect(parsePunjabVehicleNumber({})).toBeNull();
  });
});

describe("formatPunjabVehicleNumber", () => {
  it('should format "abc123" to "ABC-123"', () => {
    expect(formatPunjabVehicleNumber("abc123")).toBe("ABC-123");
  });

  it('should format "ABC 123" to "ABC-123"', () => {
    expect(formatPunjabVehicleNumber("ABC 123")).toBe("ABC-123");
  });

  it('should format "ABC-123" to "ABC-123"', () => {
    expect(formatPunjabVehicleNumber("ABC-123")).toBe("ABC-123");
  });

  it('should format "abc-123" to "ABC-123"', () => {
    expect(formatPunjabVehicleNumber("abc-123")).toBe("ABC-123");
  });

  it("should handle leading/trailing whitespace", () => {
    expect(formatPunjabVehicleNumber("  abc 123  ")).toBe("ABC-123");
  });

  it("should throw a descriptive Error for invalid vehicle numbers", () => {
    expect(() => formatPunjabVehicleNumber("AB123")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("ABCD123")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("ABC12")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("ABC1234")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("123ABC")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("ABC-12")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("ABC-1234")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
    expect(() => formatPunjabVehicleNumber("")).toThrowError(
      /Invalid Punjab vehicle registration number/
    );
  });

  it("should throw a TypeError if input is not a string", () => {
    // @ts-expect-error Testing runtime resilience
    expect(() => formatPunjabVehicleNumber(null)).toThrow(TypeError);
    // @ts-expect-error Testing runtime resilience
    expect(() => formatPunjabVehicleNumber(undefined)).toThrow(TypeError);
    // @ts-expect-error Testing runtime resilience
    expect(() => formatPunjabVehicleNumber(123)).toThrow(TypeError);
    // @ts-expect-error Testing runtime resilience
    expect(() => formatPunjabVehicleNumber({})).toThrow(TypeError);
  });
});

describe("TypeScript type predicate narrowing", () => {
  it("should narrow unknown type to string when isPunjabVehicleNumber returns true", () => {
    const input: unknown = "abc-123";
    if (isPunjabVehicleNumber(input)) {
      // TypeScript allows string methods without compilation error
      const formatted = formatPunjabVehicleNumber(input);
      expect(formatted).toBe("ABC-123");
    } else {
      expect.fail("Should have identified input as a valid vehicle number");
    }
  });
});

describe("Whitespace handling consistency", () => {
  it("should demonstrate whitespace trimming in helper functions vs exact pattern match", () => {
    const untrimmed = "  ABC-123  ";
    expect(isPunjabVehicleNumber(untrimmed)).toBe(true);
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test(untrimmed)).toBe(false);
    expect(PUNJAB_VEHICLE_NUMBER_PATTERN.test(untrimmed.trim())).toBe(true);
  });
});

