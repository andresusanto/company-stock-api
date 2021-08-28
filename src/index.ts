import { merge } from "lodash";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";

import config from "@src/utils/config";
import { openDB } from "@src/utils/db";
import { logger } from "@src/utils/logger";

import Query from "@src/models/@query.graphql";
import Company from "@src/models/company.graphql";
import ClosingPrice from "@src/models/closing-price.graphql";
import SnowflakeScore from "@src/models/snowflake-score.graphql";

import createCompanyResolver from "@src/resolvers/company";
import createClosingPriceResolver from "@src/resolvers/closing-price";
import createSnowflakeScoreResolver from "@src/resolvers/snowflake-score";

(async () => {
  const db = await openDB();

  const server = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs: [Query, Company, ClosingPrice, SnowflakeScore],
      resolvers: merge(
        createCompanyResolver(db),
        createClosingPriceResolver(db),
        createSnowflakeScoreResolver(db)
      ),
    }),
    introspection: config.ENABLE_INTROSPECTION,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
  });

  server.listen().then(({ url }) => {
    logger.info(`Server is ready at ${url}`);
    if (config.ENABLE_INTROSPECTION) logger.info("Introspection is enabled");
  });
})();
