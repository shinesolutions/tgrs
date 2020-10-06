import jwt from "jsonwebtoken";
import { Config, ForbiddenError, SchemaDirectiveVisitor } from "apollo-server";
import { MessageDataSource } from "./MessageDataSource";
import { isUndefined, isString, isNull } from "lodash";
import { Object as JsonObject } from "json-typescript";
import * as fs from "fs";
import * as path from "path";
import { GraphQLField } from "graphql";
import { resolvers } from "./resolvers";
import { assert } from "./assert";
import { BaseContext } from "./context";

export function createConfig<TIntegrationContext>(
  env: { readonly [key: string]: string | undefined },
  getHeader: (
    integrationContext: TIntegrationContext,
    headerName: string
  ) => string | undefined
): Config {
  const messageServerUrlParamName = "messageServerUrl";
  const messageServerUrl = env[messageServerUrlParamName];

  if (isUndefined(messageServerUrl)) {
    throw new Error(messageServerUrlParamName);
  }

  return {
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
    schemaDirectives: {
      requiresUser: UserDirective,
    },
    dataSources: () => ({
      message: new MessageDataSource(messageServerUrl),
    }),
    context: function (integrationContext: TIntegrationContext): BaseContext {
      const authHeader = getHeader(integrationContext, "Authorization");

      let user;

      if (!isUndefined(authHeader)) {
        const payload = jwt.decode(authHeader);
        assert(!isNull(payload), authHeader);
        assert(!isString(payload), authHeader);

        // If we've gotten this far, we will assume that the payload is valid JSON
        const json: JsonObject = payload;

        const { name } = json;

        // Check that the JSON has the fields we want
        assert(isString(name), JSON.stringify(name));

        user = { name };
      }

      return {
        user,
      };
    },
  };
}

/**
 * Custom directive that restricts access to a field to logged-in users. At the
 * moment just checks for the presence of a user, but in future could be
 * extended to check that the user has particular roles, for example.
 */
class UserDirective extends SchemaDirectiveVisitor {
  // Use `any` for the source as we don't care what it is
  visitFieldDefinition(field: GraphQLField<any, BaseContext>) {
    // Override the resolver for the field so that, if no user is available,
    // an error is raised
    const { resolve: originalResolve } = field;
    field.resolve = async function (source, args, context, info) {
      if (isUndefined(context.user)) {
        throw new ForbiddenError("No user available");
      }
      return originalResolve?.call(this, source, args, context, info);
    };
  }
}
