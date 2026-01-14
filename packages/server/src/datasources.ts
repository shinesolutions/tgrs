import { RESTDataSource } from "@apollo/datasource-rest";

export class MessageDataSource extends RESTDataSource {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }

  async getMessage() {
    return this.get("/");
  }
}
