# Generates code that is used by the client. The first command-line argument 
# will be passed directly into `apollo client:codegen`. Note that this only 
# cleans out previously-generated files at startup. You'll have to restart it
# to force a clean.

set -o errexit

# Remove all previously generated code. This helps pick up type errors as 
# quickly as possible, especially when renaming or moving files, because any
# of our own files that depend on old generated code will immediately fail to 
# compile. 
#
# Note that deleting generated code like this can cause the TypeScript compiler
# to briefly report errors about missing files before the new code is generated.
# Furthermore, sometimes the compiler can hang, even after the code has been 
# generated successfully. To work around this, try saving one of our regular 
# non-generated files to re-trigger a build.
find . -type d -name '__generated__'|xargs rm -rf

# Now actually generate the code.
apollo client:codegen $1 --target typescript --globalTypesFile src/__generated__/globalTypes.ts --passthroughCustomScalars --customScalarsPrefix=S