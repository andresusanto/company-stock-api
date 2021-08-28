import { logger } from "@src/utils/logger";
import { SnowflakeScore, Resolvers } from "@src/@codegen";
import { getSnowflakeScore } from "@src/models/snowflake-score";

import gqlFieldGetter from "graphql-fields";
import { Database } from "sqlite";
import { ApolloError } from "apollo-server";

export default function createSnowflakeScoreResolver(
  db: Database,
  getFields = gqlFieldGetter
): Resolvers {
  return {
    Company: {
      async score(company, arg, _, info) {
        const fields = Object.keys(getFields(info)) as Array<
          keyof SnowflakeScore
        >;
        const res = await getSnowflakeScore(db, fields, company.id);

        if (!res) {
          logger.error("expecting to get score but get null instead", {
            company,
          });
          throw new ApolloError("cannot get snowflake score");
        }
        return res;
      },
    },
  };
}
