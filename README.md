# TGRS (TypeScript/GraphQL/React/Serverless) Sample Project

React part still to be completed

## Initial Setup

1.  [Install nodenv](https://github.com/nodenv/nodenv#installation)
2.  [Install yarn 1.x](https://classic.yarnpkg.com/en/docs/install)
3.  [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
4.  Run `nodenv install`
5.  Run `yarn install`
6.  (Optional but recommended) Install [GraphiQL](https://www.electronjs.org/apps/graphiql)

## Starting the servers

1.  Start the stub REST server:

        yarn workspace server startRestStub

2.  Then either:

    - Start the GraphQl server inside an Express instance:

      1. Run `yarn workspace server start`
      2. Go to the [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/)
         at http://localhost:4000, or point GraphiQL at that URL

    or,

    - Start the GraphQL server inside a local instance of API Gateway:

      1. Run `yarn workspace server build`
      2. Go to `packages/server`
      3. Run `sam local start-api --port 5000`
      4. Go to the GraphQL Playground at http://localhost:5000, or point
         GraphiQL at that URL

3.  Configure either Playground or GraphiQL to include an `Authorization`
    header that is an encoded JWT with a field called `name`. In Playground,
    you can set this header with the user name name `John Doe` by adding the
    following to the 'HTTP HEADERS' tab:

    ```
    {
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
    ```

    To create your own token, we recommend using https://jwt.io.

4.  In Playground or GraphiQL, run the query:

        query {
          greeting
        }

## Running the tests

To run the tests:

     yarn test
