import { assert } from "./assert";
import { isUndefined } from "lodash";
import { Resolvers } from "./__generatedTypes__";

export const resolvers: Resolvers = {
  Query: {
    greeting: async (_, __, { dataSources }) => {
      return `${await dataSources.message.getMessage()}!`;
    },
    personalizedGreeting: async (_, __, { user, dataSources }) => {
      assert(!isUndefined(user));
      return `${await dataSources.message.getMessage()}, ${user.name}!`;
    },
  },
};
