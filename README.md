# TGRS (TypeScript/GraphQL/React/Serverless) Sample Project

## Initial Setup

1.  [Install nodenv](https://github.com/nodenv/nodenv#installation)
2.  [Install yarn 1.x](https://classic.yarnpkg.com/en/docs/install)
3.  [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
4.  Run `nodenv install`
5.  Run `yarn install`
6.  (Optional but recommended) Install [GraphiQL](https://www.electronjs.org/apps/graphiql)

## Quick Start

1.  Start the stub REST server:

        yarn workspace server startRestStub

2.  Start the GraphQl server inside an Express instance:

        yarn workspace server start

3.  Set up a client environment file that configures the client to talk to the Express server:

        ln -sf ../env/localhost-4000.json packages/client/public/env.json

4.  Start the client:

        yarn workspace client start

5.  Go to http://localhost:3000

## Starting the GraphQL Server in a local Lambda

To start the GraphQL server in a lambda that is accessible to a local instance of API
Gateway:

1. Run `yarn workspace server build`
2. Go to `packages/server`
3. Run `sam local start-api --port 5000`
4. Go to the GraphQL Playground at http://localhost:5000, or point
   GraphiQL at that URL
5. Go to the next section

## Calling a GraphQL server directly

To call a GraphQl server directly:

1.  Configure either Playground or GraphiQL to include an `Authorization`
    header that is an encoded JWT with a field called `name`. In Playground,
    you can set this header with the user name name `John Doe` by adding the
    following to the 'HTTP HEADERS' tab:

    ```
    {
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
    ```

    To create your own token, we recommend using https://jwt.io.

2.  In Playground or GraphiQL, run the query:

        query {
          greeting
        }

## Running the tests

To run the tests:

     yarn workspace server test
