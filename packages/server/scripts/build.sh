# Does a production build of the server. Any arguments will be passed onto 
# the TypeScript compiler.
set -o errexit
mkdir -p dist
cp -r node_modules src/schema.graphql ./dist
tsc $1