# pakistani-vehicle-number

A tiny TypeScript utility for formatting and structurally validating Pakistani vehicle registration numbers.

Zero runtime dependencies. Dual ESM and CommonJS support with strict TypeScript declarations.

---

## Structural Validation Disclaimer

> **Important:** This package performs **structural format validation only**.
>
> * It checks whether a string conforms to official vehicle registration format specifications.
> * It **does NOT** verify whether a vehicle number actually exists in the Punjab Excise & Taxation Department or MTMIS (Motor Transport Management Information System) database.
> * It **does NOT** check vehicle ownership, active registration status, or tax records.
> * It **does NOT** infer provinces from arbitrary plate strings.

---

## Current V1 Scope

V1 specifically supports the **Punjab Universal Numbering Scheme** announced by the Punjab Excise, Taxation and Narcotics Control Department on January 29, 2025.

### Supported Format

* **Letters:** Exactly 3 letters (`A–Z`), case-insensitive
* **Separator:** Optional single space (` `), single hyphen (`-`), or no separator
* **Digits:** Exactly 3 digits (`0–9`)
* **Normalized Output:** Always formatted as `ABC-123`

| Input | Valid | Normalized | Notes |
| :--- | :---: | :--- | :--- |
| `ABC123` | ✅ | `ABC-123` | No separator |
| `ABC 123` | ✅ | `ABC-123` | Space separator |
| `ABC-123` | ✅ | `ABC-123` | Hyphen separator |
| `abc123` | ✅ | `ABC-123` | Case-insensitive |
| `abc-123` | ✅ | `ABC-123` | Case-insensitive |
| `  ABC 123  ` | ✅ | `ABC-123` | Outer whitespace trimmed |

### Invalid Examples

| Input | Valid | Reason |
| :--- | :---: | :--- |
| `AB123` | ❌ | Exactly 3 letters required (received 2) |
| `ABCD123` | ❌ | Exactly 3 letters required (received 4) |
| `ABC12` | ❌ | Exactly 3 digits required (received 2) |
| `ABC1234` | ❌ | Exactly 3 digits required (received 4) |
| `123ABC` | ❌ | Letters must precede digits |
| `ABC-12` | ❌ | Only 2 digits |
| `ABC-1234` | ❌ | 4 digits |
| `ABC--123` | ❌ | Multiple separators not allowed |
| `ABC  123` | ❌ | Multiple spaces not allowed |
| `ABC_123` | ❌ | Underscore is not a valid separator |
| `ABC/123` | ❌ | Slash is not a valid separator |

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
```

### CommonJS

```javascript
const {
  formatPunjabVehicleNumber,
  isPunjabVehicleNumber,
  parsePunjabVehicleNumber,
} = require("pakistani-vehicle-number");
```

---

## Usage Examples

### Formatting

`formatPunjabVehicleNumber()` normalizes any valid representation into `ABC-123`.

```ts
import { formatPunjabVehicleNumber } from "pakistani-vehicle-number";

formatPunjabVehicleNumber("abc123");   // "ABC-123"
formatPunjabVehicleNumber("ABC 123");  // "ABC-123"
formatPunjabVehicleNumber("ABC-123");  // "ABC-123"
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
import { isPunjabVehicleNumber, formatPunjabVehicleNumber } from "pakistani-vehicle-number";

isPunjabVehicleNumber("ABC 123"); // true
isPunjabVehicleNumber("abc-123"); // true
isPunjabVehicleNumber("ABC123");  // true
isPunjabVehicleNumber("ABCD123"); // false
isPunjabVehicleNumber("ABC12");   // false

// Safe with arbitrary input types:
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

Returns `true` if `value` is a valid Punjab vehicle number string; otherwise returns `false`. Never throws.

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

Future releases will add structural validation for additional Pakistani registration formats:

- [ ] Sindh vehicle registration schemes (e.g. `ABC-1234`)
- [ ] Islamabad Capital Territory (ICT) registration formats
- [ ] Khyber Pakhtunkhwa (KPK) registration formats
- [ ] Balochistan registration formats
- [ ] Legacy Punjab series (district-based codes and year prefixes)

---

## License

MIT © [Ahmed Younas](https://github.com/<username>/pakistani-vehicle-number)
