# Clients Reference

Different projects have slightly different requirements regarding the error handling, request and response processing and other logic.
These requirements should be implemented as an `HTTPClient` instance, which in turn is provided to the generated controllers.

Resources:
- For developing a custom `HTTPClient`, please refer to [Developers Guide - HTTP clients](../development/clients.md);
- The repository contains a few [examples](../../examples/clients) of HTTPClient implementation for common libraries;
