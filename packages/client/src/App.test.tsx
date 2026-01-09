import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import App from "./App";
import { setupServer } from "msw/node";
import { graphql } from "msw";

// Setup requests interception using the given handlers.
const server = setupServer();

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});

describe("App", () => {
  it("loads greeting", async () => {
    server.use(
      graphql.query("AppQuery", (_, res, ctx) =>
        res(
          ctx.data({
            personalizedGreeting: "Hello, Unit Test!",
          })
        )
      )
    );

    render(
      <ApolloProvider
        client={
          new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink(),
          })
        }
      >
        <App />
      </ApolloProvider>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Loading...");

    const heading = await waitFor(() => screen.getByRole("heading"));
    expect(heading).toHaveTextContent("Hello, Unit Test!");
  });
});
