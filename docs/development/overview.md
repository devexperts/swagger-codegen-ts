# Development: Overview

TODO: describe the architecture and data flows

### FAQ
  1. **Why don't spec codecs reuse common parts?**
   
     That's because different versions of specs refer to different versions of [JSON Schema](http://json-schema.org) and they are generally not the same. We would like to avoid maintaining JSON Schema composition in this project. (for now)  

### Publish
`npm version major|minor|patch`
