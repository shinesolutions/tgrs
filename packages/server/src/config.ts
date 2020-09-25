import jwt from "jsonwebtoken";

import { MessageDataSource } from "./MessageDataSource";
import { isUndefined, isString, isNull } from "lodash";
import { Object as JsonObject } from "json-typescript";
import * as fs from "fs";
import * as path from "path";

export function createConfig<TIntegrationContext>(
  env: { readonly [key: string]: string | undefined },
  getHeader: (
    integrationContext: TIntegrationContext,
    headerName: string
  ) => string | undefined
) {
  const messageServerUrlParamName = "messageServerUrl";
  const messageServerUrl = env[messageServerUrlParamName];

  if (isUndefined(messageServerUrl)) {
    throw new Error(messageServerUrlParamName);
  }

  return {
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
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
      message: new MessageDataSource(messageServerUrl),
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

      // If we've gotten this far, we will assume that the payload is valid JSON
      const json: JsonObject = payload;

      const { name } = json;

      // Check that the JSON has the fields we want
      if (!isString(name)) {
        throw new Error(JSON.stringify(name));
      }

      return {
        userName: name,
      };
    },
  };
}
