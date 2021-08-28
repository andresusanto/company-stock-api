import { Database } from "sqlite";
import { UserInputError } from "apollo-server";
import { Company } from "@src/@codegen";
import { GraphQLResolveInfo } from "graphql";
import createClosingPriceResolver from "@src/resolvers/closing-price";

test("invalid fromDate", async () => {
  const mockDb = jest.fn();
  const resolver = createClosingPriceResolver({
    all: mockDb,
  } as unknown as Database);
  const resolvePrice = resolver.Company && resolver.Company.prices;
  if (typeof resolvePrice !== "function")
    fail(`expecting to get function but got ${typeof resolvePrice}`);

  await expect(
    resolvePrice(
      { id: "123" } as Company,
      {
        fromDate: "11",
        toDate: "2020-01-01",
      },
      null,
      {} as GraphQLResolveInfo
    )
  ).rejects.toEqual(new UserInputError("invalid fromDate"));
  expect(mockDb).not.toBeCalled();
});

test("invalid toDate", async () => {
  const mockDb = jest.fn();
  const resolver = createClosingPriceResolver({
    all: mockDb,
  } as unknown as Database);
  const resolvePrice = resolver.Company && resolver.Company.prices;
  if (typeof resolvePrice !== "function")
    fail(`expecting to get function but got ${typeof resolvePrice}`);

  await expect(
    resolvePrice(
      { id: "123" } as Company,
      {
        fromDate: "2020-01-01",
        toDate: "2020-01-XX",
      },
      null,
      {} as GraphQLResolveInfo
    )
  ).rejects.toEqual(new UserInputError("invalid toDate"));
  expect(mockDb).not.toBeCalled();
});
