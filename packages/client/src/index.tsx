import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Value as JsonValue, Object as JsonObject } from "json-typescript";
import { isArray, isBoolean, isNull, isNumber, isString } from "lodash";

// Use a top-level async immediately-invoked function expression so that we can
// use `await` inside of it
(async function () {
  const env: JsonValue = await (await fetch("/env.json")).json();

  // Check that the env JSON is just a plain JS object
  assert(
    !(
      isArray(env) ||
      isBoolean(env) ||
      isNull(env) ||
      isString(env) ||
      isNumber(env)
    ),
    JSON.stringify(env)
  );

  // Check that the env JSON contains a valid server URI string
  const { serverUri, integrationAuthToken } = env as JsonObject;

  assertIsString(serverUri);
  assert(
    isString(integrationAuthToken) || isNull(integrationAuthToken),
    JSON.stringify(integrationAuthToken)
  );

  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider
        client={
          new ApolloClient({
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              // Add an authorization header to each outgoing request. In a real
              // application, this could also be obtained from an auth provider.
              // However, in this system we just mock up the auth provider by
              // using an auth token that has been embedded in the env file.
              setContext(() => ({
                headers: {
                  Authorization: integrationAuthToken,
                },
              })),
              new HttpLink({ uri: serverUri }),
            ]),
          })
        }
      >
        <App />
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
})();

function assertIsString(value: JsonValue): asserts value is string {
  assert(isString(value), JSON.stringify(value));
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
