# depot

File sharing service.

## Trivia

Due to being a university assignment, the project contains implementation of LZ77 algorithm.

The implementation is mostly based on [@vincentcorbee](https://github.com/vincentcorbee)'s [article](https://medium.com/@vincentcorbee/lz77-compression-in-javascript-cd2583d2a8bd).

## Development environment

Compose file `docker-compose.dev.yml` provides configuration that should be used during development.

Run `docker compose --file docker-compose.dev.yml up --build` to use it.
