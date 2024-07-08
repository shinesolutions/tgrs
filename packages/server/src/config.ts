import { isUndefined } from "lodash";
import { makeExecutableSchema } from "@graphql-tools/schema";
import * as fs from "fs";
import * as path from "path";
import { GraphQLSchema } from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";
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

export function createConfig(): ApolloServerOptions<BaseContext> {
  let schema = userRequiredDirective(
    makeExecutableSchema({
      typeDefs: [
        fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
      ],
      resolvers,
    })
  );

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
function userRequiredDirective(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const userDirective = getDirective(
        schema,
        fieldConfig,
        "requiresUser"
      )?.[0];
      if (userDirective) {
        const originalResolve = fieldConfig.resolve;
        fieldConfig.resolve = async function (source, args, context, info) {
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
