import { Database } from "sqlite";
import { UserInputError } from "apollo-server";
import { GraphQLResolveInfo } from "graphql";
import createCompanyResolver from "@src/resolvers/company";

test("company found", async () => {
  const mockDb = jest.fn().mockImplementation((_, companyId) => {
    expect(companyId).toEqual("123");
    return { id: "123", name: "test" };
  });
  const mockGetFields = jest
    .fn()
    .mockImplementation(() => ({ name: null, tickerSymbol: null }));
  const resolver = createCompanyResolver(
    { get: mockDb } as unknown as Database,
    mockGetFields
  );

  const resolveCompany = resolver.Query && resolver.Query.getCompany;
  if (typeof resolveCompany !== "function")
    fail(`expecting to get function but got ${typeof resolveCompany}`);

  await expect(
    resolveCompany(
      {},
      { id: "123" },
      null,
      null as unknown as GraphQLResolveInfo
    )
  ).resolves.toEqual({ id: "123", name: "test" });
  expect(mockGetFields).toBeCalledTimes(1);
  expect(mockDb).toBeCalledTimes(1);
});

test("company not found", async () => {
  const mockDb = jest.fn().mockImplementation((_, companyId) => {
    expect(companyId).toEqual("123");
    return null;
  });
  const mockGetFields = jest
    .fn()
    .mockImplementation(() => ({ name: null, tickerSymbol: null }));
  const resolver = createCompanyResolver(
    { get: mockDb } as unknown as Database,
    mockGetFields
  );

  const resolveCompany = resolver.Query && resolver.Query.getCompany;
  if (typeof resolveCompany !== "function")
    fail(`expecting to get function but got ${typeof resolveCompany}`);

  await expect(
    resolveCompany(
      {},
      { id: "123" },
      null,
      null as unknown as GraphQLResolveInfo
    )
  ).rejects.toEqual(new UserInputError("company not found"));
  expect(mockGetFields).toBeCalledTimes(1);
  expect(mockDb).toBeCalledTimes(1);
});
