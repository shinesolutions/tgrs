import { isUndefined } from "lodash";
import { makeExecutableSchema } from "@graphql-tools/schema";
import * as fs from "fs";
import * as path from "path";
import { GraphQLSchema } from "graphql";
import { mapSchema, getDirectives, MapperKind } from "@graphql-tools/utils";
import { resolvers } from "./resolvers";
import { BaseContext } from "./context";
import { assertIsNotUndefined } from "shared";

import { ApolloServerErrorCode } from "@apollo/server/errors";
import { ApolloServerOptions } from "@apollo/server";

export interface Env {
  messageServerUrl?: string;
}

/**
 * The context information that needs to be extracted from each incoming request
 */
export interface RequestContext {
  user: BaseContext;
}

export function createConfig<ContextValue>(
  env: Env,
  getHeader: (
    integrationContext: ContextValue,
    headerName: string
  ) => string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ApolloServerOptions<BaseContext> {
  let schema = makeExecutableSchema({
    typeDefs: [fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8")],
    resolvers,
  });
  /* Directives! */

  return {
    schema,
    includeStacktraceInErrorResponses: false,
    formatError: (gqlError) => {
      assertIsNotUndefined(gqlError.extensions);
      if (
        gqlError.extensions.code ===
        ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return {
          ...gqlError,
          // Return a less descriptive error message to client, if desired.
          // Ensure the client gets only necessary amount of information needed
          // below can be uncommented to give a less descriptive message in this validation error case
          // message: "Your query doesn't match the schema. Try double-checking it!",
        };
      }
      return gqlError;
    },
  };
}

/**
 * Custom directive that restricts access to a field to logged-in users. At the
 * moment just checks for the presence of a user, but in future could be
 * extended to check that the user has particular roles, for example.
 */

function userRequiredDirective(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const userDirective = getDirectives(schema, fieldConfig, [
        directiveName,
      ])?.[0];
      if (userDirective) {
        const { resolve: originalResolve } = fieldConfig;
        fieldConfig.resolve = async function (
          source: any, //eslint-disable-line @typescript-eslint/no-explicit-any
          args: any, //eslint-disable-line @typescript-eslint/no-explicit-any
          context: RequestContext,
          info
        ) {
          if (isUndefined(context.user)) {
            throw new Error("No user available");
          }
          return originalResolve?.call(this, source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}
