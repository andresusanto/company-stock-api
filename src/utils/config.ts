import path from "path";

export default {
  PORT: parseInt(process.env.PORT || "3000"),
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DATA_SOURCE:
    process.env.DATA_SOURCE || path.join(process.cwd(), "data", "sws.sqlite3"),
};
