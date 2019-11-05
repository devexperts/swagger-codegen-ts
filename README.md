[![Build Status](https://travis-ci.org/devexperts/swagger-codegen-ts.svg?branch=master)](https://travis-ci.org/devexperts/swagger-codegen-ts)
 
### FAQ
  1. **Why don't spec codecs reuse common parts?**
   
     That's because different versions of specs refer to different versions of [JSON Schema](http://json-schema.org) and they are generally not the same. We would like to avoid maintaining JSON Schema composition in this project. (for now)  

### Contributions
- use https://www.conventionalcommits.org/en/v1.0.0-beta.2/

### Publish
`npm version major|minor|patch`
