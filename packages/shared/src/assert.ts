import { Value as JsonValue } from "json-typescript";
import { isString, isUndefined } from "lodash";

export function assert(
  condition: boolean,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertIsString(value: JsonValue): asserts value is string {
  assert(isString(value), JSON.stringify(value));
}

export function assertIsNotUndefined<T>(
  value: T | undefined
): asserts value is T {
  assert(!isUndefined(value));
}
