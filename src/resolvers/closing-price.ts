import { ClosingPrice, Resolvers } from "@src/@codegen";
import { getClosingPrices } from "@src/models/closing-price";

import gqlFieldGetter from "graphql-fields";
import { Database } from "sqlite";
import { UserInputError } from "apollo-server";

export default function createClosingPriceResolver(
  db: Database,
  getFields = gqlFieldGetter
): Resolvers {
  return {
    Company: {
      async prices(company, { fromDate, toDate }, _, info) {
        const dateFormat = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        if (!dateFormat.test(fromDate))
          throw new UserInputError("invalid fromDate");
        if (!dateFormat.test(toDate))
          throw new UserInputError("invalid toDate");

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
