import { MessageDataSource } from "./MessageDataSource";

// Context that does not include datasources that are added automatically by
// Apollo
export interface BaseContext {
  user?: {
    name: string;
  };
}

export interface Context extends BaseContext {
  dataSources: {
    message: MessageDataSource;
  };
}
