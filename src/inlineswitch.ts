/**
 * Represents a predicate function for pattern matching
 */
export type PredicatePattern<T> = (value: T) => boolean;

/**
 * Represents a pattern to match against a value
 * - Direct value: matches exactly
 * - Array of values: matches if the value is in the array
 * - Function: matches if the function returns true
 */
export type CasePattern<T> = T | T[] | PredicatePattern<T>;

/**
 * Represents a handler function for a matched case
 */
export type CaseHandler<T, R> = (value: T) => R;

/**
 * Represents a single case in the switch statement
 */
export type SwitchCase<T, R> = [CasePattern<T>, CaseHandler<T, R>];

/**
 * Type guard to check if a pattern is a predicate function
 */
function isPredicate<T>(
  pattern: CasePattern<T>
): pattern is PredicatePattern<T> {
  return typeof pattern === "function";
}

/**
 * Type guard to check if a pattern is an array
 */
function isArrayPattern<T>(pattern: CasePattern<T>): pattern is T[] {
  return Array.isArray(pattern);
}

/**
 * Error thrown when duplicate case values are detected
 */
export class DuplicateCaseError extends Error {
  constructor(values: any[]) {
    super(`Duplicate case values: ${values.join(", ")}`);
    this.name = "DuplicateCaseError";
  }
}

/**
 * An enhanced switch function that supports pattern matching
 * @param value The value to match against case patterns
 * @param cases An array of case patterns and their handlers
 * @param defaultHandler Optional default handler if no cases match
 * @returns The result of the matched handler or the default handler, or undefined
 */
export function inlineSwitch<T, R>(
  value: T,
  cases: SwitchCase<T, R>[],
  defaultHandler?: CaseHandler<T, R>
): R | undefined {
  // Check for duplicate simple values
  const simpleValues = cases
    .filter(([pattern]) => !isArrayPattern(pattern) && !isPredicate(pattern))
    .map(([pattern]) => pattern);

  const duplicates = simpleValues.filter(
    (val, index) => simpleValues.indexOf(val) !== index
  );

  if (duplicates.length > 0) {
    throw new DuplicateCaseError(duplicates);
  }

  // Find matching case
  const matchedCase = cases.find(([pattern]) => {
    if (isArrayPattern(pattern)) {
      return pattern.includes(value);
    } else if (isPredicate(pattern)) {
      return pattern(value);
    } else {
      return pattern === value;
    }
  });

  if (matchedCase) {
    return matchedCase[1](value);
  }

  return defaultHandler ? defaultHandler(value) : undefined;
}

/**
 * Shorthand version for simple value-only checks
 * This is useful for simple cases without predicates
 */
export function switchValue<T, R>(
  value: T,
  ...cases: Array<[T | T[], CaseHandler<T, R>]>
): R | undefined {
  return inlineSwitch(value, cases);
}
