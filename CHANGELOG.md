# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-30

### Added
- Initial release supporting the Punjab Universal Numbering Scheme (`ABC 123` format).
- `formatPunjabVehicleNumber(value: string)` to format inputs into normalized `ABC-123`.
- `isPunjabVehicleNumber(value: unknown)` to structurally validate vehicle registration inputs.
- `parsePunjabVehicleNumber(value: string)` to parse vehicle registration strings into structured objects.
- Exported `PUNJAB_VEHICLE_NUMBER_PATTERN` RegExp.
- Exported `PunjabVehicleNumber` interface.
- Dual CommonJS and ESM support with full TypeScript type declarations.
- Zero runtime dependencies.
