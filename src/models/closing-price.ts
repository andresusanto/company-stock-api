import { ClosingPrice } from "@src/@codegen";
import { Database } from "sqlite";

function getDatabaseFieldName(modelField: keyof ClosingPrice): string | null {
  switch (modelField) {
    case "date":
      return "date";
    case "price":
      return "price";
    case "dateCreated":
      return "date_created as dateCreated";
    default:
      return null;
  }
}

/**
 * getClosingPrices returns the closing stock price of
 * a company ('companyId') from fromDate to toDate.
 *
 * The primary key (date, company_id) would result in
 * suboptimal query performance when filtering out
 * closing prices using WHERE date >= ? AND date <= ? AND
 * company_id = ?. Therefore, an additional index
 * namely `swsCompanyPriceClose_company_date` is created
 * to make the operation fast.
 *
 * The time complexity for this operation is O(k) where
 * k is the distance/number of days between fromDate
 * and toDate.
 *
 * See /data/INDEX-ANALYSIS.md for more details
 */
export async function getClosingPrices(
  db: Database,
  fields: Array<keyof ClosingPrice>,
  companyId: string,
  fromDate: string,
  toDate: string
): Promise<Array<ClosingPrice>> {
  const dbFields = fields
    .map(getDatabaseFieldName)
    .filter((field): field is string => field !== null)
    .join(",");
  if (!dbFields.length)
    throw new Error("getClosingPrices: empty fields after mapping");

  const res = await db.all<Array<ClosingPrice>>(
    `SELECT ${dbFields} 
        FROM swsCompanyPriceClose 
        WHERE company_id = ? 
        AND date >= ? 
        AND date <= ? 
        ORDER BY date DESC`,
    companyId,
    fromDate,
    toDate
  );
  return res;
}
