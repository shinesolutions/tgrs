import jwt from "jsonwebtoken";

import { MessageDataSource } from "./MessageDataSource";
import { isUndefined, isString, isNull } from "lodash";
import { Object as JsonObject } from "json-typescript";

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
          __: {},
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
      if (isUndefined(authHeader)) {
        throw new Error();
      }

      const payload = jwt.decode(authHeader);
      if (isNull(payload) || isString(payload)) {
        throw new Error(authHeader);
      }

      const json: JsonObject = payload;

      const { name } = json;

      if (!isString(name)) {
        throw new Error(JSON.stringify(name));
      }

      return {
        userName: name,
      };
    },
  };
}
