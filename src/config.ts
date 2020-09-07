const jwt = require("jsonwebtoken");

import { MessageDataSource } from "./MessageDataSource";

export function createConfig<TIntegrationContext>(
  env: { messageServerUrl: string },
  getHeader: (
    integrationContext: TIntegrationContext,
    headerName: string
  ) => string | undefined
) {
  return {
    typeDefs: `
      type Query {
        greeting: String!
      }
    `,
    resolvers: {
      Query: {
        greeting: async (
          _: {},
          args: {},
          context: {
            userName: string;
          } & {
            dataSources: { message: MessageDataSource };
          }
        ) =>
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
