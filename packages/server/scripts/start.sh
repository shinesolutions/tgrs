yarn install #is quick to run, always ensures we have installed correctly

yarn run concurrently "yarn codegen --watch" \
    "yarn run nodemon --ext ts,graphql,json --exec 'npx' tsx ./scripts/startDevServer.ts"