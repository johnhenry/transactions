// @ts-ignore
import { Transaction } from "./types.ts";
// @ts-ignore
import { specialQuery, transactionQuery } from "./mongoDBQueries.ts";
// Return all transactions from Database
export const transactions = async (): Promise<Transaction[]> => {
  try {
    const dataResponse = await transactionQuery("find", {});
    const { documents } = await dataResponse.json();
    if (documents) {
      return documents;
    }
  } catch {
    return [];
  }
  return [];
};
// Return all specials from Database
export const specials = async (): Promise<String[]> => {
  try {
    const dataResponse = await specialQuery("findOne", {
      filter: { name: "specials" },
    });
    const { document } = await dataResponse.json();
    return document.special || [];
  } catch {
    return [];
  }
};
