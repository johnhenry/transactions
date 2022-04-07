// @ts-ignore
import { Transaction, Success } from "./types.ts";
// @ts-ignore
import { specialQuery, transactionQuery } from "./mongoDBQueries.ts";
// @ts-ignore
import { specials as getSpecials } from "./query.ts";
// Add transaction to Database
export const addTransaction = async (
  _: any,
  {
    amount,
    category,
    date,
    merchant_name,
  }: {
    amount: Number;
    category: String[];
    date: String;
    merchant_name: String;
  }
): Promise<Transaction> => {
  const dataResponse = await transactionQuery("insertOne", {
    document: {
      amount,
      category,
      date,
      merchant_name,
    },
  });
  try {
    const { document } = await dataResponse.json();
    return document;
  } catch {
    return {
      _id: "",
      amount: 0,
      category: [""],
      date: "",
      hidden: false,
      merchant_name: "",
    };
  }
};
// Hide transaction in Database
export const hideTransaction = async (
  _: any,
  { _id }: { _id: String }
): Promise<Success> => {
  try {
    const dataResponse = await transactionQuery("updateOne", {
      filter: { _id: { $oid: _id } },
      update: {
        $set: { hidden: true },
      },
    });

    const res = await dataResponse.json();
    return { success: true };
  } catch {
    return { success: false };
  }
};
// Show transaction in Database
export const showTransaction = async (
  _: any,
  { _id }: { _id: String }
): Promise<Success> => {
  try {
    const dataResponse = await transactionQuery("updateOne", {
      filter: { _id: { $oid: _id } },
      update: {
        $set: { hidden: false },
      },
    });
    const { document } = await dataResponse.json();
    return { success: true };
  } catch {
    return { success: false };
  }
};
// Add special to Database
export const addSpecial = async (
  _: any,
  { special }: { special: String }
): Promise<Success> => {
  try {
    const specials = (await getSpecials()) || [];
    if (!specials.includes(special)) {
      specials.push(special);
    }
    const dataResponse = await specialQuery("updateOne", {
      filter: { name: "specials" },
      update: {
        $set: { special: specials },
      },
      upsert: true,
    });
    const { document } = await dataResponse.json();
    return { success: true };
  } catch {
    return { success: false };
  }
};
// Remove special from Database
export const removeSpecial = async (
  _: any,
  { special }: { special: String }
): Promise<Success> => {
  try {
    const specials = (await getSpecials()) || [];
    if (specials.includes(special)) {
      const index = specials.indexOf(special);
      specials.splice(index, 1);
    }
    const dataResponse = await specialQuery("updateOne", {
      filter: { name: "specials" },
      update: {
        $set: { special: specials },
      },
      upsert: true,
    });
    const { document } = await dataResponse.json();
    return { success: true };
  } catch {
    return { success: false };
  }
};
