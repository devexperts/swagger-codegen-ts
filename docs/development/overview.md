# Development: Overview

TODO: describe the architecture and data flows

### FAQ
  1. **Why don't spec codecs reuse common parts?**

     That's because different versions of specs refer to different versions of [JSON Schema](http://json-schema.org) and they are generally not the same. We would like to avoid maintaining JSON Schema composition in this project. (for now)

### Publish

GitHub Actions are configured to build and publish a new version when a [new release](https://github.com/devexperts/swagger-codegen-ts/releases/new) is created in GitHub.

If you need to run this process manually:
```
# bumps the version in package.json, builds the dist files
# and commits the updated CHANGELOG.md
yarn version

# uploads the package to the registry
yarn publish
```
