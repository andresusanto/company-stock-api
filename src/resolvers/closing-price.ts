import { ClosingPrice, Resolvers } from "@src/@codegen";
import { getClosingPrices } from "@src/models/closing-price";

import getFields from "graphql-fields";
import { Database } from "sqlite";

export default function createClosingPriceResolver(db: Database): Resolvers {
  return {
    Company: {
      async prices(company, { fromDate, toDate }, _, info) {
        // TODO: handle fromDate and toDate validation

        const fields = Object.keys(getFields(info)) as Array<
          keyof ClosingPrice
        >;
        const res = await getClosingPrices(
          db,
          fields,
          company.id,
          fromDate,
          toDate
        );
        return res;
      },
    },
  };
}
