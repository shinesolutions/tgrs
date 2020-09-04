import { Config } from "apollo-server";

const jwt = require("jsonwebtoken");

const { MessageDataSource } = require("./MessageDataSource");

export function createConfig<TIntegrationContext>(
  env,
  getHeader: (
    integrationContext: TIntegrationContext,
    headerName: string
  ) => string
) {
  return {
    typeDefs: `
      type Query {
        greeting: String!
      }
    `,
    resolvers: {
      Query: {
        greeting: async (source, args, context) =>
          `${await context.dataSources.message.getMessage()}, ${
            context.userName
          }!`,
      },
    },
    dataSources: () => ({
      message: new MessageDataSource(env.messageServerUrl),
    }),
    context: function (integrationContext: TIntegrationContext) {
      const authHeader = getHeader(integrationContext, "Authorization");
      const payload = jwt.decode(authHeader);

      return {
        userName: payload.name,
      };
    },
  };
}
