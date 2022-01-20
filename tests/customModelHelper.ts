import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
};

const database = knex(dbConnection);

export const create = async <T>(tableName: string, record: T) => {
  const [id] = await database(tableName).insert(record);
  console.log("created new record:", { id });
  return matchUnique(tableName, { id });
};

export const match = async <T>(tableName: string, query: T) => {
  return database(tableName).select("*").where(query);
};

export const matchUnique = async <T>(tableName: string, query: T) => {
  const matches = await match(tableName, query);
  if (matches.length === 1) {
    console.log("matchUnique matched result");
    return matches[0];
  } else if (matches.length === 0) {
    console.log("matchUnique no match", { query });
    return null;
  } else {
    console.warn("matchUnique is not unique", { query, matches });
    throw new Error("The match being made is not unique");
  }
};

export const update = async <T>(tableName: string, updateFilter: T, updateFields: T) => {
  const updatedResultCount = await database(tableName).where(updateFilter).update(updateFields);
  return updatedResultCount;
};

export const deleteRecords = async <T>(tableName: string, deleteQuery: T) => {
  const deletedRecordCount = await database(tableName).where(deleteQuery).del();
  return deletedRecordCount;
};
