import { ApolloServer } from "@apollo/server";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Env, createConfig } from "./config";
import { handlers, startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";

/**
 * Create a basic server, for use with `startServerAndCreateLambdaHandler` function
 */
const server = new ApolloServer({
  ...createConfig(
    // Get environment-specific information from environment variables
    process.env as Env,
    (integrationContext: { event: APIGatewayProxyEvent }, headerName) =>
      // Because we're running in an AWS Lambda, extract headers from the
      // lambda event
      integrationContext.event.headers[headerName]
  ),
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    middleware: [
      async (event) => {
        console.log("###? received event body=" + JSON.stringify(event.body));
        // @ts-ignore
        event.requestContext["http"] = { method: event.requestContext.httpMethod }; //have to do this otherwise error in request handler
      },
    ]
  }
);
