// @ts-ignore
import CreateMongoDBQuery from "https://johnhenry.github.io/lib/js/mongodb.com-api/0.0.0/index.mjs";
import {
  APP_ID,
  DATA_API_KEY,
  DATA_SOURCE,
  DATABASE,
  // @ts-ignore
} from "../../settings.ts";
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
