import { assertIsNotUndefined } from "shared";
import { Env } from "./config";
import { MessageDataSource } from "./datasources";

export * from "./config";

export interface DataSources {
  message: MessageDataSource;
}

export function getDataSources(env: Env): DataSources {
  const { messageServerUrl } = env;
  assertIsNotUndefined(messageServerUrl);
  return {
    message: new MessageDataSource(messageServerUrl!),
  };
}
