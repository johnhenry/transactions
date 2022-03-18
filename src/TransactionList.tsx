import type { Component } from "solid-js";
import { For, createSignal, Suspense } from "solid-js";
import { request } from "@solid-primitives/graphql";
import { DEFAULT_URI } from "./settings.js";

const sortStrings = (a: string, b: string) => {
  return a < b ? -1 : a > b ? 1 : 0;
};

const sortArrays = (a: string[], b: string[]) => {
  const A = a.sort(sortStrings)[0] || "";
  const B = b.sort(sortStrings)[0] || "";
  return sortStrings(A, B);
};

const TransactionList: Component<{
  transactions: any[];
  specials: Set<string>;
  refetch: Function;
}> = (props: {
  transactions: any[];
  specials: Set<string>;
  refetch: Function;
}) => {
  const [orderBy, setOrderBy] = createSignal("");
  const [orderAscending, setOrderAscending] = createSignal(true);
  const orderedTransactions = () => {
    let ordered = props.transactions;

    switch (orderBy()) {
      case "amount":
        ordered = props.transactions.sort((a, b) => {
          return a.amount - b.amount;
        });
        break;
      case "category":
        ordered = props.transactions.sort((a, b) => {
          return sortArrays(a.category, b.category);
        });
        break;
      case "date":
        ordered = props.transactions.sort((a, b) => {
          return sortStrings(a.date, b.date);
        });
        break;
      case "merchant_name":
        ordered = props.transactions.sort((a, b) => {
          return sortStrings(a.merchant_name, b.merchant_name);
        });
        break;
      case "hidden":
        ordered = props.transactions.sort((a, b) => {
          return sortStrings(a.hidden, b.hidden);
        });
        break;
    }
    if (!orderAscending()) {
      ordered = ordered.reverse();
    }
    return ordered;
  };

  return (
    <div class="transaction-list">
      <table>
        <Suspense
          fallback={
            <tr>
              <td colspan="100%">Loading Transactions...</td>
            </tr>
          }
          children={null}
        >
          {/* <Show when={orderedTransactions().length} children={null}> */}
          <tr
            classList={{
              ascending: orderAscending(),
              descending: !orderAscending(),
            }}
          >
            <th
              onClick={() => {
                setOrderBy("amount");
                setOrderAscending(!orderAscending());
              }}
              classList={{ "order-by": orderBy() === "amount" }}
            >
              Amount
            </th>
            <th
              onClick={() => {
                setOrderBy("category");
                setOrderAscending(!orderAscending());
              }}
              classList={{ "order-by": orderBy() === "category" }}
            >
              Category
            </th>
            <th
              onClick={() => {
                setOrderBy("date");
                setOrderAscending(!orderAscending());
              }}
              classList={{ "order-by": orderBy() === "date" }}
            >
              Date
            </th>
            <th
              onClick={() => {
                setOrderBy("merchant_name");
                setOrderAscending(!orderAscending());
              }}
              classList={{ "order-by": orderBy() === "merchant_name" }}
            >
              Merchant
            </th>
            <th
              onClick={() => {
                setOrderBy("hidden");
                setOrderAscending(!orderAscending());
              }}
              classList={{ "order-by": orderBy() === "hidden" }}
            >
              Hide
            </th>
          </tr>

          <For each={orderedTransactions()} children={null}>
            {(transaction: any) => {
              const bezos = props.specials.has(transaction.merchant_name);
              return (
                <tr
                  classList={{
                    transaction: true,
                    "bezos-colored": bezos,
                    "not-showing": transaction.hidden,
                  }}
                >
                  <td>${transaction.amount}</td>
                  <td>{transaction.category.sort(sortStrings).join(",")}</td>
                  <td>{transaction.date}</td>
                  <td>
                    {transaction.merchant_name}{" "}
                    <button
                      classList={{ bezoslist: true }}
                      onClick={async () => {
                        await request(
                          DEFAULT_URI,
                          `mutation {
                        ${bezos ? "remove" : "add"}Special(special: "${
                            transaction.merchant_name
                          }") {
                          success
                        }
                      }`
                        );
                        props.refetch();
                      }}
                    >
                      {" "}
                    </button>
                  </td>
                  <td>
                    <button
                      classList={{ hide: true }}
                      onClick={async () => {
                        await request(
                          DEFAULT_URI,
                          `mutation {
                        ${
                          transaction.hidden ? "show" : "hide"
                        }Transaction(_id: "${transaction._id}") {
                          success
                        }
                      }`
                        );
                        props.refetch();
                      }}
                    >
                      {" "}
                    </button>
                  </td>
                </tr>
              );
            }}
          </For>
          {/* </Show> */}
        </Suspense>
      </table>
    </div>
  );
};
export default TransactionList;
