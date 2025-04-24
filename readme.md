# Inline Switch

A flexible inline switch statement with pattern matching for TypeScript/JavaScript.

## Installation

```bash
npm install inlineswitch
```

## Features

- Match against exact values, arrays of values, or predicate functions
- Type-safe with full TypeScript support
- More concise and readable than long if-else chains
- Supports default handlers for non-matching cases
- Checks for duplicate case values
- Tiny library with zero dependencies

## Usage

### Basic Usage

```typescript
import { inlineSwitch } from "inlineswitch";

const result = inlineSwitch(
  value,
  [
    [5, (v) => `Exact match: ${v}`],
    [[1, 2, 3], (v) => `Array match: ${v}`],
    [(v) => v > 10, (v) => `Predicate match: ${v}`],
  ],
  (v) => `Default: ${v}` // Optional default handler
);
```

### Different Types of Patterns

```typescript
// Exact value matching
const dayName = inlineSwitch(
  dayNumber,
  [
    [0, () => "Sunday"],
    [1, () => "Monday"],
    [2, () => "Tuesday"],
    [3, () => "Wednesday"],
    [4, () => "Thursday"],
    [5, () => "Friday"],
    [6, () => "Saturday"],
  ],
  () => "Invalid day"
);

// Array matching
const fruitCategory = inlineSwitch(
  fruit,
  [
    [["apple", "pear"], () => "pome"],
    [["peach", "plum", "cherry"], () => "drupe"],
    [["grape", "blueberry"], () => "berry"],
  ],
  () => "other"
);

// Predicate function matching
const sizeCategory = inlineSwitch(length, [
  [(v) => v < 10, () => "small"],
  [(v) => v >= 10 && v < 100, () => "medium"],
  [(v) => v >= 100, () => "large"],
]);
```

### Shorthand for Simple Cases

```typescript
import { switchValue } from "inlineswitch";

// Simpler syntax for value-only checks
const result = switchValue(
  color,
  ["red", () => "#FF0000"],
  ["green", () => "#00FF00"],
  ["blue", () => "#0000FF"]
);
```

## API

### `inlineSwitch<T, R>(value: T, cases: SwitchCase<T, R>[], defaultHandler?: CaseHandler<T, R>): R | undefined`

The main function that implements pattern matching.

- `value`: The value to match against case patterns
- `cases`: An array of case patterns and their handlers
- `defaultHandler`: Optional default handler if no cases match
- Returns the result of the matched handler or the default handler, or undefined

### `switchValue<T, R>(value: T, ...cases: Array<[T | T[], CaseHandler<T, R>]>): R | undefined`

A shorthand version for simple value-only checks.

## Types

```typescript
type CasePattern<T> = T | T[] | ((value: T) => boolean);
type CaseHandler<T, R> = (value: T) => R;
type SwitchCase<T, R> = [CasePattern<T>, CaseHandler<T, R>];
```

## Error Handling

The library throws a `DuplicateCaseError` when duplicate case values are detected.

## License

MIT
