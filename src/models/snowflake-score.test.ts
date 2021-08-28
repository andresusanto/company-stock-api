import { Database } from "sqlite";
import { getSnowflakeScore } from "@src/models/snowflake-score";

test("filter-out skipped field", async () => {
  const mockDb = jest.fn().mockImplementation((query: string, companyId) => {
    expect(companyId).toEqual("companyId");
    expect(query).toEqual(
      expect.stringMatching(
        /^SELECT dividend,date_generated as dateGenerated[\s\n]+FROM.+/
      )
    );
    return "mock";
  });

  await expect(
    getSnowflakeScore(
      { get: mockDb } as unknown as Database,
      ["__typename", "dividend", "dateGenerated"],
      "companyId"
    )
  ).resolves.toEqual("mock");

  expect(mockDb).toBeCalledTimes(1);
});

test("throw error if resulting field is empty", async () => {
  const mockDb = jest.fn();

  await expect(
    getSnowflakeScore({ get: mockDb } as unknown as Database, [], "Company")
  ).rejects.toEqual(new Error("getSnowflakeScore: empty fields after mapping"));
  await expect(
    getSnowflakeScore(
      { get: mockDb } as unknown as Database,
      ["__typename"],
      "Company"
    )
  ).rejects.toEqual(new Error("getSnowflakeScore: empty fields after mapping"));

  expect(mockDb).not.toBeCalled();
});
