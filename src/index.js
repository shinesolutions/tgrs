const { ApolloServer } = require("apollo-server");
const { createConfig } = require("./config");
const env = require("./env.json");

const server = new ApolloServer(
  createConfig(
    // Get environment-specific information from the env.json file
    env,
    (integrationContext, headerName) =>
      // Because we're running in Express, extract headers from Express
      // requests
      integrationContext.req.header(headerName)
  )
);

server.listen().then(() => console.log("Ready!"));
