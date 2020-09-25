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
import { Value as JsonValue } from "json-typescript";
import { isArray, isBoolean, isNull, isNumber, isString } from "lodash";

// Use a top-level async immediately-invoked function expression so that we can
// use `await` inside of it
(async function () {
  const env: JsonValue = await (await fetch("/env.json")).json();

  // If the env JSON object is anything other than a plain JS object, raise an
  // error
  if (
    isArray(env) ||
    isBoolean(env) ||
    isNull(env) ||
    isString(env) ||
    isNumber(env)
  ) {
    throw new Error(JSON.stringify(env));
  }

  // Check that the env JSON contains a valid server URI string
  const { serverUri } = env;

  if (!isString(serverUri)) {
    throw new Error(JSON.stringify(serverUri));
  }

  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider
        client={
          new ApolloClient({
            cache: new InMemoryCache(),
            link: ApolloLink.from([
              // Add an authorization header to each outgoing request
              setContext(() => ({
                headers: {
                  Authorization:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
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
