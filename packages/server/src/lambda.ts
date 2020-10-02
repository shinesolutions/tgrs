import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import { createConfig } from "./config";

const server = new ApolloServer(
  createConfig(
    // Get environment-specific information from environment variables
    process.env,
    (integrationContext: { event: APIGatewayProxyEvent }, headerName) =>
      // Because we're running in an AWS Lambda, extract headers from the
      // lambda event
      integrationContext.event.headers[headerName]
  )
);

exports.handler = server.createHandler();
