import { Database } from "sqlite";
import { getClosingPrices } from "@src/models/closing-price";

test("filter-out skipped field", async () => {
  const mockDb = jest
    .fn()
    .mockImplementation((query: string, companyId, fromDate, toDate) => {
      expect(companyId).toEqual("companyId");
      expect(fromDate).toEqual("from");
      expect(toDate).toEqual("to");
      expect(query).toEqual(expect.stringMatching(/^SELECT date[\s\n]+FROM.+/));
      return "mock";
    });

  await expect(
    getClosingPrices(
      { all: mockDb } as unknown as Database,
      ["__typename", "date"],
      "companyId",
      "from",
      "to"
    )
  ).resolves.toEqual("mock");

  expect(mockDb).toBeCalledTimes(1);
});

test("throw error if resulting field is empty", async () => {
  const mockDb = jest.fn();

  await expect(
    getClosingPrices(
      { all: mockDb } as unknown as Database,
      [],
      "1",
      "from",
      "to"
    )
  ).rejects.toEqual(new Error("getClosingPrices: empty fields after mapping"));
  await expect(
    getClosingPrices(
      { all: mockDb } as unknown as Database,
      ["__typename"],
      "1",
      "from",
      "to"
    )
  ).rejects.toEqual(new Error("getClosingPrices: empty fields after mapping"));

  expect(mockDb).not.toBeCalled();
});
