yarn run concurrently "yarn codegen --watch" \
    "yarn run nodemon --ext ts,graphql,json --exec 'ts-node' scripts/startDevServer"