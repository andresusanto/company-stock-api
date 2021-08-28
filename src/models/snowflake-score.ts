import { SnowflakeScore } from "@src/@codegen";
import { Database } from "sqlite";

function getDatabaseFieldName(modelField: keyof SnowflakeScore): string | null {
  switch (modelField) {
    case "dateGenerated":
      return "date_generated as dateGenerated";
    case "sentence":
      return "sentence";
    case "dividend":
      return "dividend";
    case "future":
      return "future";
    case "health":
      return "health";
    case "management":
      return "management";
    case "past":
      return "past";
    case "value":
      return "value";
    case "misc":
      return "misc";
    case "total":
      return "total";
    default:
      return null;
  }
}

export async function getSnowflakeScore(
  db: Database,
  fields: Array<keyof SnowflakeScore>,
  companyId: string
): Promise<SnowflakeScore | undefined> {
  const dbFields = fields
    .map(getDatabaseFieldName)
    .filter((field): field is string => field !== null)
    .join(",");
  if (!dbFields.length)
    throw new Error("getSnowflakeScore: empty fields after mapping");

  const res = await db.get<SnowflakeScore>(
    `SELECT ${dbFields} 
        FROM swsCompanyScore 
        WHERE company_id = ?`,
    companyId
  );
  return res;
}
