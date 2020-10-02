import { MessageDataSource } from "./MessageDataSource";
import { RequestContext } from "./RequestContext";
import { assert } from "./assert";
import { isUndefined } from "lodash";

type Context = RequestContext & {
  dataSources: {
    message: MessageDataSource;
  };
};

export const resolvers = {
  Query: {
    greeting: async (_: {}, __: {}, { dataSources }: Context) => {
      return `${await dataSources.message.getMessage()}!`;
    },
    personalizedGreeting: async (
      _: {},
      __: {},
      { user, dataSources }: Context
    ) => {
      assert(!isUndefined(user));
      return `${await dataSources.message.getMessage()}, ${user.name}!`;
    },
  },
};
