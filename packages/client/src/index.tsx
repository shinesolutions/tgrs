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
            new HttpLink({ uri: "http://localhost:4000" }),
          ]),
        })
      }
    >
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
