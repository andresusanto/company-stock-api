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
