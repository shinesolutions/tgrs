# TGRS Sample Project

![master build](https://github.com/shinesolutions/tgrs/workflows/build/badge.svg?branch=master)

TGRS stands for [TypeScript](https://www.typescriptlang.org/),
[GraphQL](https://www.graphql.com/), [React](https://reactjs.org/) and
[serverless](https://en.wikipedia.org/wiki/Serverless_computing). This is a
sample project that demonstrates the key technologies in this stack. 

For a general overview of the stack and the decisions behind it, see
[Introducing the TGRS stack for web interfaces](https://shinesolutions.com/2021/07/30/introducing-the-tgrs-stack-for-web-interfaces/),
or check out [this presentation from the React Melbourne Meetup](https://www.youtube.com/watch?v=-Idub5K7K6Q&t=209s).

## Initial Setup

1.  [Install nodenv](https://github.com/nodenv/nodenv#installation)
2.  [Install yarn 1.x](https://classic.yarnpkg.com/en/docs/install)
3.  [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
4.  Run `nodenv install`
5.  Run `yarn install`
6.  (Optional but recommended) Install [GraphiQL](https://www.electronjs.org/apps/graphiql)

## Quick Start

1.  Start the integration environment stub REST server:

        yarn workspace integration startStubby

2.  Set up a server environment file that configures the server to talk to the
    integration environment's stub REST server:

        ln -sf ./env.integration.json packages/server/env.json

3.  Build the code that is shared by both the client and server:

        yarn workspace shared build

4.  Start the GraphQl server inside an Express instance:

        yarn workspace server start

5.  Set up a client environment file that configures the client to talk to the
    GraphQL Express server:

        ln -sf ../env/localhost-4000.json packages/client/public/env.json

6.  Start the client:

        yarn workspace client start

7.  Go to http://localhost:3000

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

For endpoints that _don't_ require that there be a logged-in user, just run the
query in Playground or GraphiQL. For example:

        query {
          greeting(language: ENGLISH)
        }

For endpoints that _do_ require there be a logged-in user, you'll need to first
Configure either Playground or GraphiQL to include an `Authorization` header
that is an encoded JWT with a field called `name`. In Playground, you can set
this header with the user name name `John Doe` by adding the following to the
'HTTP HEADERS' tab:

        {
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        }

To create your own token, we recommend using https://jwt.io.

You can then run the query. For example:

        query {
                personalizedGreeting(language: ENGLISH)
        }

## Running the integration tests

To run the integration tests:

     yarn workspace integration test

## Code Formatting

Note that this project uses [Prettier](https://prettier.io/) to
format code, and that if incorrectly formatted code is pushed to a
branch, then that branch's build will fail. Use `yarn format` to
format your code, or configure your editor to automatically format
your code using the version of Prettier in this project.
