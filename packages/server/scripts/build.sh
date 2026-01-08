# Does a production build of the server using tsup
set -o errexit
yarn codegen
tsup
# Copy node_modules to dist for Lambda deployment
cp -r node_modules ./dist