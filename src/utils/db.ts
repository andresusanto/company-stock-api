import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import config from "@src/utils/config";

export async function openDB(): Promise<Database> {
  const db = await open({
    filename: config.DATA_SOURCE,
    driver: sqlite3.Database,
  });

  return db;
}
