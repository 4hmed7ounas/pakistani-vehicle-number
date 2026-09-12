# pakistani-vehicle-number

[![npm version](https://img.shields.io/npm/v/pakistani-vehicle-number.svg)](https://www.npmjs.com/package/pakistani-vehicle-number)
[![npm downloads](https://img.shields.io/npm/dw/pakistani-vehicle-number.svg)](https://www.npmjs.com/package/pakistani-vehicle-number)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![bundle size](https://img.shields.io/bundlephobia/min/pakistani-vehicle-number)](https://bundlephobia.com/package/pakistani-vehicle-number)

A tiny TypeScript utility for formatting and structurally validating Pakistani vehicle registration numbers.

Zero runtime dependencies. Dual ESM and CommonJS support with strict TypeScript declarations.

---

## Value Proposition

* **Zero runtime dependencies** — minimal footprint, fast, and secure
* **TypeScript-first** — includes complete type definitions and type predicates
* **Dual module support** — first-class ESM (`import`) and CommonJS (`require`)
* **Focused utility** — purpose-built for Punjab Universal plate formatting and structural validation
* **Application-ready** — ideal for web forms, backend APIs, data pipelines, ETL, and database normalization

---

## Structural Validation Disclaimer

> **Important:** This package performs **structural format validation only**.
>
> - It checks whether a string conforms to official vehicle registration format specifications.
> - It **does NOT** verify whether a vehicle number actually exists in the Punjab Excise & Taxation Department or MTMIS (Motor Transport Management Information System) database.
> - It **does NOT** check vehicle ownership, active registration status, or tax records.
> - It **does NOT** determine whether a plate actually exists.
> - It **does NOT** infer provinces from arbitrary plate strings.
> - It **does NOT** support arbitrary historical or legacy plate formats.

---

## Current Scope (v1.0.0)

v1.0.0 specifically supports the **Punjab Universal Numbering Scheme** announced by the Punjab Excise, Taxation and Narcotics Control Department on January 29, 2025.

### Supported Format

* **Letters:** Exactly 3 letters (`A–Z`), case-insensitive
* **Separator:** Optional single space (` `), single hyphen (`-`), or no separator
* **Digits:** Exactly 3 digits (`0–9`)
* **Normalized Output:** Always formatted as `ABC-123`

### Format Examples

#### Valid
```text
ABC123
ABC 123
ABC-123
abc123
```

#### Normalized
```text
ABC123  → ABC-123
ABC 123 → ABC-123
abc123  → ABC-123
```

#### Invalid
```text
AB123      (requires exactly 3 letters)
ABCD123    (requires exactly 3 letters)
ABC12      (requires exactly 3 digits)
ABC1234    (requires exactly 3 digits)
123ABC     (letters must precede digits)
ABC-12     (requires exactly 3 digits)
ABC-1234   (requires exactly 3 digits)
```

| Input | Valid | Normalized | Notes |
| :--- | :---: | :--- | :--- |
| `ABC123` | ✅ | `ABC-123` | Standard no separator |
| `ABC 123` | ✅ | `ABC-123` | Standard space separator |
| `ABC-123` | ✅ | `ABC-123` | Standard hyphen separator |
| `abc123` | ✅ | `ABC-123` | Case-insensitive |
| `abc-123` | ✅ | `ABC-123` | Case-insensitive |
| `  ABC 123  ` | ✅ | `ABC-123` | Outer whitespace trimmed |
| `AB123` | ❌ | — | Only 2 letters |
| `ABCD123` | ❌ | — | 4 letters |
| `ABC12` | ❌ | — | Only 2 digits |
| `ABC1234` | ❌ | — | 4 digits |
| `123ABC` | ❌ | — | Inverted order |
| `ABC--123` | ❌ | — | Multiple separators |
| `ABC_123` | ❌ | — | Invalid separator |

---

## Installation

```bash
npm install pakistani-vehicle-number
```

```bash
pnpm add pakistani-vehicle-number
# or
yarn add pakistani-vehicle-number
# or
bun add pakistani-vehicle-number
```

---

## Quick Start

### ESM / TypeScript

```ts
import {
  formatPunjabVehicleNumber,
  isPunjabVehicleNumber,
  parsePunjabVehicleNumber,
} from "pakistani-vehicle-number";

// Formatting
formatPunjabVehicleNumber("abc123");
// "ABC-123"

// Validation (TypeScript type guard)
isPunjabVehicleNumber("ABC-123");
// true

// Parsing
parsePunjabVehicleNumber("ABC 123");
// {
//   province: "punjab",
//   format: "universal",
//   letters: "ABC",
//   number: "123",
//   normalized: "ABC-123"
// }
```

### CommonJS

```javascript
const {
  formatPunjabVehicleNumber,
  isPunjabVehicleNumber,
  parsePunjabVehicleNumber,
} = require("pakistani-vehicle-number");

console.log(formatPunjabVehicleNumber("abc 123")); // "ABC-123"
console.log(isPunjabVehicleNumber("ABC-123"));      // true
```

---

## Usage Guide

### Formatting

`formatPunjabVehicleNumber()` normalizes any valid representation into `ABC-123`.

```ts
import { formatPunjabVehicleNumber } from "pakistani-vehicle-number";

formatPunjabVehicleNumber("abc123");     // "ABC-123"
formatPunjabVehicleNumber("ABC 123");    // "ABC-123"
formatPunjabVehicleNumber("ABC-123");    // "ABC-123"
formatPunjabVehicleNumber("  lea 456 "); // "LEA-456"

// Invalid inputs throw an Error:
try {
  formatPunjabVehicleNumber("AB123");
} catch (err) {
  console.error(err.message);
  // Invalid Punjab vehicle registration number: "AB123". Expected format: 3 letters followed by 3 digits (e.g. ABC 123, ABC-123, or ABC123).
}
```

### Validation

`isPunjabVehicleNumber()` checks format validity safely without throwing. It acts as a TypeScript type guard (`value is string`).

```ts
import {
  isPunjabVehicleNumber,
  formatPunjabVehicleNumber,
} from "pakistani-vehicle-number";

isPunjabVehicleNumber("ABC 123"); // true
isPunjabVehicleNumber("abc-123"); // true
isPunjabVehicleNumber("ABC123");  // true
isPunjabVehicleNumber("ABCD123"); // false
isPunjabVehicleNumber("ABC12");   // false

// Safe with non-string types (never throws):
isPunjabVehicleNumber(null);      // false
isPunjabVehicleNumber(undefined); // false
isPunjabVehicleNumber(123456);    // false
isPunjabVehicleNumber({});        // false

// Type narrowing in TypeScript:
const rawInput: unknown = "abc-123";

if (isPunjabVehicleNumber(rawInput)) {
  // rawInput is narrowed to string:
  const normalized = formatPunjabVehicleNumber(rawInput); // "ABC-123"
}
```

### Parsing

`parsePunjabVehicleNumber()` extracts structured components or returns `null` for invalid input.

```ts
import { parsePunjabVehicleNumber } from "pakistani-vehicle-number";

const result = parsePunjabVehicleNumber("lea 456");

if (result) {
  console.log(result);
  // {
  //   province: "punjab",
  //   format: "universal",
  //   letters: "LEA",
  //   number: "456",
  //   normalized: "LEA-456"
  // }
}

parsePunjabVehicleNumber("invalid"); // null
parsePunjabVehicleNumber("");        // null
```

---

## API Reference

### `formatPunjabVehicleNumber(value: string): string`

Formats a Punjab registration number string into normalized `ABC-123`.

* **Throws `TypeError`** if `value` is not a string.
* **Throws `Error`** if `value` does not structurally match the scheme.

### `isPunjabVehicleNumber(value: unknown): value is string`

Type guard that returns `true` if `value` is a valid Punjab vehicle number string; otherwise returns `false`. Never throws.

### `parsePunjabVehicleNumber(value: string): PunjabVehicleNumber | null`

Parses a valid registration string into a `PunjabVehicleNumber` object. Returns `null` if invalid or non-string.

### `PunjabVehicleNumber` Interface

```ts
interface PunjabVehicleNumber {
  province: "punjab";
  format: "universal";
  letters: string;
  number: string;
  normalized: string;
}
```

### `PUNJAB_VEHICLE_NUMBER_PATTERN: RegExp`

Exported stateless regular expression: `/^[A-Za-z]{3}[ -]?[0-9]{3}$/`.

> **Note on whitespace:** The helper functions `formatPunjabVehicleNumber()`, `isPunjabVehicleNumber()`, and `parsePunjabVehicleNumber()` trim surrounding whitespace. The raw regex `PUNJAB_VEHICLE_NUMBER_PATTERN` tests exact token boundaries without surrounding whitespace, suitable for HTML `<input pattern="...">` attributes.

---

## Roadmap

Potential future versions may add:

- Sindh vehicle number formats
- Islamabad Capital Territory formats
- KPK formats
- Balochistan formats
- legacy Punjab formats

These are not supported in v1.0.0.

---

## License

MIT © [Ahmed Younas](https://github.com/4hmed7ounas/pakistani-vehicle-number)
