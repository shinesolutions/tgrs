import jwt from "jsonwebtoken";
import { isUndefined, isString, isNull } from "lodash";
import { Object as JsonObject } from "json-typescript";
import { assert, assertIsString } from "./";

/**
 * Gets information about the current user from an auth token. Because both the
 * client and the server may want to do this, we put it in the `shared`
 * workspace. Note that this does not verify the token, it only decodes it.
 *
 * @param authToken the auth token to get the user information from, or
 * undefined if there is no such auth token
 * @returns information about the user, or `undefined` if there was no auth
 * token
 */
export function getUserFromAuthToken(
  authToken: string | undefined
): { name: string } | undefined {
  if (!isUndefined(authToken)) {
    const payload = jwt.decode(authToken);
    assert(!isNull(payload), authToken);
    assert(!isString(payload), authToken);

    // If we've gotten this far, we will assume that the payload is valid JSON
    const json: JsonObject = payload;

    const { name } = json;

    // Check that the JSON has the fields we want
    assertIsString(name);

    return { name };
  }

  return undefined;
}
