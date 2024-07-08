import { ApolloServer } from "@apollo/server";
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "@as-integrations/aws-lambda";
import { createConfig } from "./index";
/**
 * Create a basic server, for use with `startServerAndCreateLambdaHandler` function
 */
const server = new ApolloServer(createConfig());

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    middleware: [
      async (event) => {
        console.log("###? received event body=" + JSON.stringify(event.body));
        // @ts-ignore
        event.requestContext["http"] = {
          // @ts-ignore
          method: event.requestContext.httpMethod,
        }; //have to do this otherwise error in request handler
      },
    ],
  }
);
