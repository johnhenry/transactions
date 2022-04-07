// @ts-ignore
import { APP_ID, DATA_API_KEY, DATA_SOURCE, DATABASE } from "../settings.ts";
// Create Function that query's the MongoDB API
const CreateMongoDBQuery =
  ({
    APP_ID,
    DATA_API_KEY,
    COLLECTION,
    DATABASE,
    DATA_SOURCE,
  }: {
    APP_ID: String;
    DATA_API_KEY: String;
    COLLECTION: String;
    DATABASE: String;
    DATA_SOURCE: String;
  }) =>
  (path: string, fields: object) => {
    return fetch(
      `https://data.mongodb-api.com/app/${APP_ID}/endpoint/data/beta/action/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": DATA_API_KEY as string,
        },
        body: JSON.stringify({
          collection: COLLECTION,
          database: DATABASE,
          dataSource: DATA_SOURCE,
          ...fields,
        }),
      }
    );
  };
// Query transaction_list collection
export const transactionQuery = CreateMongoDBQuery({
  APP_ID,
  DATA_API_KEY,
  DATA_SOURCE,
  DATABASE,
  COLLECTION: "transaction_list",
});
// Query special_list collection
export const specialQuery = CreateMongoDBQuery({
  APP_ID,
  DATA_API_KEY,
  DATA_SOURCE,
  DATABASE,
  COLLECTION: "special_list",
});
