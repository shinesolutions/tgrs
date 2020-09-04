const jwt = require("jsonwebtoken");

const { MessageDataSource } = require("./MessageDataSource");

exports.createConfig = function (env, getHeader) {
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
    context: function (integrationContext) {
      const authHeader = getHeader(integrationContext, "Authorization");
      const payload = jwt.decode(authHeader);

      return {
        userName: payload.name,
      };
    },
  };
};
