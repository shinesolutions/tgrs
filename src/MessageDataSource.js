const { RESTDataSource } = require("apollo-datasource-rest");

exports.MessageDataSource = class extends RESTDataSource {
  constructor(baseUrl) {
    super();
    this.baseURL = baseUrl;
  }

  async getMessage() {
    return this.get("/");
  }
};
