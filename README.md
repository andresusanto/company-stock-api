# Company Stock API &middot; [![Build](https://github.com/andresusanto/company-stock-api/actions/workflows/build.yml/badge.svg)](https://github.com/andresusanto/company-stock-api/actions/workflows/build.yml) [![License](https://img.shields.io/github/license/andresusanto/company-stock-api.svg)](https://github.com/andresusanto/company-stock-api/blob/main/LICENSE)

A simple backend microservice that provides access to company stock data such as their name, tickers, last share prices, and [snowflake scores](https://github.com/SimplyWallSt/Company-Analysis-Model/blob/master/MODEL.markdown#the-snowflake).

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/andresusanto/company-stock-api)

In short, this API:

- provides GraphQL interface to query company data.
- performs highly optimised database queries using fast index lookup, see [Index Analysis](./data/INDEX-ANALYSIS.md).
- is packaged as a Docker container and can be deployed in any docker container hosting, including Kubernetes.

### Demo

[<img width="780" alt="image" src="https://user-images.githubusercontent.com/7076809/131243830-6727d04e-723a-44fc-b7fc-96f2c92cd693.png">](https://studio.apollographql.com/sandbox?endpoint=https%3A%2F%2Fcompany-stock-api.herokuapp.com%2F)

A demo instance of this API is available on Heroku:

**[Demo (using Apollo GraphQL Studio)](https://studio.apollographql.com/sandbox?endpoint=https%3A%2F%2Fcompany-stock-api.herokuapp.com%2F)**

## The Stack

1. **App:** TypeScript/Node.js with Apollo GraphQL Server.
2. **Code Generation:** `graphql-codegen` to automatically [generate TypeScript interfaces](./src/@codegen/index.ts) and types from the GraphQL schema.
3. **GraphQL Files and Code Packing:** Webpack with `graphql-tag/loader` to process `*.graphql` files.
4. **Code Standard and Quality:** ESLint and Prettier.
5. **Unit Testing:** Jest.
6. **Logging:** Winston.
7. **Database:** SQLite3
8. **CI/CD:** GitHub Action to automatically test, build, and deploy changes on mainline branch.

## Deploying

### Heroku

Requirements:

1. Active Heroku Account
2. Heroku CLI v7.x or newer

Steps:

```bash
# Log-in to your Heroku Account (if you have not logged in before):
$ heroku login


# Sign-in into the Heroku Container Registry by using this command:
$ heroku container:login


# Build the docker image and push it to the container registry:
$ heroku container:push web


# Release the built image:
$ heroku container:release web
```

### Other container hosting providers

As the app is packaged as a Docker container, it can be deployed on any container hosting providers such as AWS ECS, Google AppEngine, Azure ACI, or on any Kubernetes Clusters.

**Docker Image**

```bash
$ docker pull ghcr.io/andresusanto/company-stock-api:<TAG>
```

**Supported Docker Tags:**

1. `latest`, `v1.0.0` - Latest released tag
2. `main` - Mainline build _(unstable)_

[See all docker tags here](https://github.com/andresusanto/company-stock-api/pkgs/container/company-stock-api).

### Running it locally using Docker Compose:

```bash
$ docker compose up
```

## Developing

Requirements:

1. Node 14.x or newer
2. npm 7.x or newer

**Before developing:**

```bash
# Install all required tool and dependencies:

$ npm i
```

**When developing:**

```bash
# Start the local development server:

$ npm run dev
```

**After making changes:**

```bash
# Perform code generation if you made changes to any *.graphql files
$ npm run generate

# Perform code formatting (if do not have Prettier integration with Your IDE)
$ npm run format


# Perform code linting
$ npm run lint


# Perform unit-tests:
$ npm test
```

## Building

Requirements:

1. Docker v20.x or newer

Steps:

```bash
# Run the docker build command:
$ docker build -t <NAME>:<TAG> .


# Push the built image to registry
$ docker push <NAME>:<TAG>
```

## Environment Variables

See [config.ts](./src/utils/config.ts) for more details.

| Environment            | Type                                        | Description                                             | Default Value                            |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| `PORT`                 | _integer_                                   | the port in which the app should listen to.             | `3000`                                   |
| `NODE_ENV`             | _string_ (`production`, `development`)      | indicates the environment on where this app is running. |                                          |
| `ENABLE_INTROSPECTION` | _boolean_                                   | allow GraphQL Introspection query.                      | `false` if `production`, `true` if local |
| `LOG_LEVEL`            | _string_ (`debug`, `info`, `warn`, `error`) | the log level configured for the app logger.            | `info`                                   |
| `DATA_SOURCE`          | _string_                                    | the location of the CSV data source.                    | `<app location>/data/sws.sqlite3`        |

## Limitations/Trade-offs

1. The API does not have any authentication/authorisation layers for simplicity
