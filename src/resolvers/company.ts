import { Company, Resolvers } from "@src/@codegen";
import { getCompany, getCompanies } from "@src/models/company";

import getFields from "graphql-fields";
import { Database } from "sqlite";
import { UserInputError } from "apollo-server";

export default function createCompanyResolver(db: Database): Resolvers {
  return {
    Query: {
      async getCompany(_, { id }, ctx, info) {
        const fields = Object.keys(getFields(info)) as Array<keyof Company>;
        const res = await getCompany(db, fields, id);

        if (!res) throw new UserInputError("company not found");
        return res;
      },
      async getCompanies(_, { limit, offset }, ctx, info) {
        const fields = Object.keys(getFields(info)) as Array<keyof Company>;
        const res = await getCompanies(db, fields, limit, offset);

        return res;
      },
    },
  };
}
