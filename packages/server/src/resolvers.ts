import { assertIsNotUndefined } from "shared";
import { Resolvers } from "./__generatedTypes__";

export const resolvers: Resolvers = {
  Query: {
    greeting: async (_, __, { dataSources }) => {
      return `${await dataSources.message.getMessage()}!`;
    },
    personalizedGreeting: async (_, __, { user, dataSources }) => {
      assertIsNotUndefined(user);
      return `${await dataSources.message.getMessage()}, ${user.name}!`;
    },
  },
};
