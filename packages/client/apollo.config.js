const path = require("path");

module.exports = {
  client: {
    service: {
      name: "tgrs",
      localSchemaFile: path.join(
        __dirname,
        "..",
        "server",
        "src",
        "schema.graphql"
      ),
    },
  },
};
