import { Database } from "sqlite";
import { ApolloError } from "apollo-server";
import { GraphQLResolveInfo } from "graphql";
import { Logger } from "winston";

import { Company } from "@src/@codegen";
import { logger } from "@src/utils/logger";
import createSnowflakeScoreResolver from "@src/resolvers/snowflake-score";

beforeEach(() => {
  jest.resetAllMocks();
});

test("success getting snowflake score", async () => {
  const mockDb = jest.fn().mockImplementation((_, companyId) => {
    expect(companyId).toEqual("123");
    return { sentence: "123", dividend: 4 };
  });
  const mockGetFields = jest
    .fn()
    .mockImplementation(() => ({ sentence: null, dividend: null }));
  const resolver = createSnowflakeScoreResolver(
    { get: mockDb } as unknown as Database,
    mockGetFields
  );

  const resolveScore = resolver.Company && resolver.Company.score;
  if (typeof resolveScore !== "function")
    fail(`expecting to get function but got ${typeof resolveScore}`);

  await expect(
    resolveScore({ id: "123" } as Company, {}, null, {} as GraphQLResolveInfo)
  ).resolves.toEqual({ sentence: "123", dividend: 4 });
  expect(mockGetFields).toBeCalledTimes(1);
  expect(mockDb).toBeCalledTimes(1);
});

test("fail getting snowflake score", async () => {
  const mockLogger = jest
    .spyOn(logger, "error")
    .mockImplementation(() => null as unknown as Logger);
  const mockDb = jest.fn().mockImplementation((_, companyId) => {
    expect(companyId).toEqual("123");
    return null;
  });
  const mockGetFields = jest
    .fn()
    .mockImplementation(() => ({ sentence: null, dividend: null }));
  const resolver = createSnowflakeScoreResolver(
    { get: mockDb } as unknown as Database,
    mockGetFields
  );

  const resolveScore = resolver.Company && resolver.Company.score;
  if (typeof resolveScore !== "function")
    fail(`expecting to get function but got ${typeof resolveScore}`);

  await expect(
    resolveScore({ id: "123" } as Company, {}, null, {} as GraphQLResolveInfo)
  ).rejects.toEqual(new ApolloError("cannot get snowflake score"));
  expect(mockGetFields).toBeCalledTimes(1);
  expect(mockDb).toBeCalledTimes(1);
  expect(mockLogger).toBeCalledTimes(1);
});
