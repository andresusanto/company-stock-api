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

export async function getCompany(
  db: Database,
  fields: Array<keyof Company>,
  id: string
): Promise<Company | undefined> {
  const dbFields = fields
    .map(getDatabaseFieldName)
    .filter((field): field is string => field !== null)
    .join(",");

  const res = await db.get<Company>(
    `SELECT ${dbFields} 
        FROM swsCompany 
        WHERE id = ?`,
    id
  );
  return res;
}

export async function getCompanies(
  db: Database,
  fields: Array<keyof Company>,
  limit: number,
  offset: number
): Promise<Array<Company>> {
  const dbFields = fields
    .map(getDatabaseFieldName)
    .filter((field): field is string => field !== null)
    .join(",");

  const res = await db.all<Array<Company>>(
    `SELECT ${dbFields} 
        FROM swsCompany
        LIMIT ?
        OFFSET ?`,
    limit,
    offset
  );
  return res;
}
