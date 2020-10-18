import { Config, ForbiddenError, SchemaDirectiveVisitor } from "apollo-server";
import { MessageDataSource } from "./datasources";
import { isUndefined } from "lodash";
import * as fs from "fs";
import * as path from "path";
import { GraphQLField } from "graphql";
import { resolvers } from "./resolvers";
import { BaseContext } from "./context";
import { assertIsNotUndefined, getUserFromAuthToken } from "shared";

export function createConfig<TIntegrationContext>(
  env: { messageServerUrl?: string },
  getHeader: (
    integrationContext: TIntegrationContext,
    headerName: string
  ) => string | undefined
): Config {
  const messageServerUrl = env.messageServerUrl;

  assertIsNotUndefined(messageServerUrl);

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
      return {
        user: getUserFromAuthToken(
          getHeader(integrationContext, "Authorization")
        ),
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
