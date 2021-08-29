import { Database } from "sqlite";
import { getCompanies, getCompany } from "@src/models/company";

test("getCompany: filter-out skipped field", async () => {
  const mockDb = jest.fn().mockImplementation((query: string, companyId) => {
    expect(companyId).toEqual("companyId0");
    expect(query).toEqual(
      expect.stringMatching(
        /^SELECT name,listing_currency_iso as listingCountryIso[\s\n]+FROM.+/
      )
    );
    return "mock";
  });

  await expect(
    getCompany(
      { get: mockDb } as unknown as Database,
      ["__typename", "name", "prices", "listingCountryIso", "score"],
      "companyId0"
    )
  ).resolves.toEqual("mock");

  expect(mockDb).toBeCalledTimes(1);
});

test("getCompanies: filter-out skipped field", async () => {
  const mockDb = jest.fn().mockImplementation((query: string, limit) => {
    expect(limit).toEqual(10);
    expect(query).toEqual(
      expect.stringMatching(
        /^SELECT listing_currency_iso as listingCountryIso[\s\n]+FROM swsCompany[\s\n]+ORDER BY.+/
      )
    );
    return "mock";
  });

  await expect(
    getCompanies(
      { all: mockDb } as unknown as Database,
      ["__typename", "prices", "listingCountryIso"],
      10,
      null
    )
  ).resolves.toEqual("mock");

  expect(mockDb).toBeCalledTimes(1);
});

test("getCompanies: with afterCompanyID", async () => {
  const mockDb = jest
    .fn()
    .mockImplementation((query: string, afterCompanyID, limit) => {
      expect(afterCompanyID).toEqual("after");
      expect(limit).toEqual(10);
      expect(query).toEqual(
        expect.stringMatching(
          /^SELECT listing_currency_iso as listingCountryIso[\s\n]+FROM swsCompany[\s\n]+WHERE id >.+/
        )
      );
      return "mock";
    });

  await expect(
    getCompanies(
      { all: mockDb } as unknown as Database,
      ["__typename", "prices", "listingCountryIso"],
      10,
      "after"
    )
  ).resolves.toEqual("mock");

  expect(mockDb).toBeCalledTimes(1);
});

test("throw error if resulting field is empty", async () => {
  const mockDb = jest.fn();

  await expect(
    getCompanies(
      { all: mockDb } as unknown as Database,
      ["__typename", "score"],
      1,
      null
    )
  ).rejects.toEqual(new Error("getCompanies: empty fields after mapping"));
  await expect(
    getCompany(
      { get: mockDb } as unknown as Database,
      ["__typename", "prices", "score"],
      "companyId0"
    )
  ).rejects.toEqual(new Error("getCompany: empty fields after mapping"));

  expect(mockDb).not.toBeCalled();
});
