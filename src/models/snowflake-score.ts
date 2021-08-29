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

/**
 * getSnowflakeScore returns the snowflake score from the given 'companyId'.
 *
 * Originally, there is no index on field company_id, but a new index was
 * created on the database namely `swsCompanyScore_company_id`. As a result,
 * the time complexity of this method would be O(log(n)).
 *
 * See /data/INDEX-ANALYSIS.md for more details
 */
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
