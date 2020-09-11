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

1. Start the stub REST server:

   yarn startStub

2. Either:

   - Start the GraphQl server inside an Express instance:

     1. Run `yarn start`
     2. Either go to http://localhost:4000 in a browser, or point GraphiQL at that URL

     or,

   - Start the GraphQL server inside a local instance of API Gateway:

     1. Run `yarn build`
     2. Run `sam local start-api`
     3. Go to http://localhost:3000 in a browser, or point GraphiQL at that URL

Note that any queries you send to either GraphQL server should include an
`Authorization` header that is an encoded JWT with a field called `name`.
Here's a sample token with the name `John Doe`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

To create your own token, we recommend using https://jwt.io.

## Running the tests

To run the tests:

     yarn test
