import { Company } from "@src/@codegen";
import { Database } from "sqlite";

function getDatabaseFieldName(modelField: keyof Company): string | null {
  switch (modelField) {
    case "id":
      return "id";
    case "name":
      return "name";
    case "tickerSymbol":
      return "ticker_symbol as tickerSymbol";
    case "exchangeSymbol":
      return "exchange_symbol as exchangeSymbol";
    case "uniqueSymbol":
      return "unique_symbol as uniqueSymbol";
    case "dateGenerated":
      return "date_generated as dateGenerated";
    case "securityName":
      return "security_name as securityName";
    case "exchangeCountryIso":
      return "exchange_country_iso as exchangeCountryIso";
    case "listingCountryIso":
      return "listing_currency_iso as listingCountryIso";
    case "canonicalUrl":
      return "canonical_url as canonicalUrl";
    case "uniqueSymbolSlug":
      return "unique_symbol_slug as uniqueSymbolSlug";
    default:
      return null;
  }
}

/**
 * getCompany returns a single company from its ID.
 * The time complexity for this query would be O(log(n)) as
 * this query will hit sqlite_autoindex_swsCompany_1 index.
 *
 * See /data/INDEX-ANALYSIS.md for more details
 */
export async function getCompany(
  db: Database,
  fields: Array<keyof Company>,
  id: string
): Promise<Company | undefined> {
  const dbFields = fields
    .map(getDatabaseFieldName)
    .filter((field): field is string => field !== null)
    .join(",");
  if (!dbFields.length)
    throw new Error("getCompany: empty fields after mapping");

  const res = await db.get<Company>(
    `SELECT ${dbFields} 
        FROM swsCompany 
        WHERE id = ?`,
    id
  );
  return res;
}

/**
 * getCompanies returns a list of companies with ID larger than
 * 'afterCompanyID' and limited to 'limit'.
 *
 * The time complexity for this query would be O(k) where k is
 * the number of retrieved rows. This query is very efficient
 * as it does not perform FULL TABLE scan and will use
 * the sqlite_autoindex_swsCompany_1 index to skip rows before
 * the 'afterCompanyID'.
 *
 * See /data/INDEX-ANALYSIS.md for more details
 */
export async function getCompanies(
  db: Database,
  fields: Array<keyof Company>,
  limit: number,
  afterCompanyID: string | null
): Promise<Array<Company>> {
  const dbFields = fields
    .map(getDatabaseFieldName)
    .filter((field): field is string => field !== null)
    .join(",");
  if (!dbFields.length)
    throw new Error("getCompanies: empty fields after mapping");

  const params = [];
  if (afterCompanyID) params.push(afterCompanyID);
  params.push(limit);
  const res = await db.all<Array<Company>>(
    `SELECT ${dbFields} 
        FROM swsCompany
        ${afterCompanyID ? "WHERE id > ?" : ""}
        ORDER BY id
        LIMIT ?`,
    ...params
  );
  return res;
}
