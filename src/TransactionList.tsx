import type { Component } from "solid-js";
import { createSignal, Show, For } from "solid-js";
import { gql, request } from "@solid-primitives/graphql";
import { DEFAULT_URI } from "./settings.js";

const TransactionList: Component = (props: {
  transactions: [];
  specials: Set;
  refetch: Function;
}) => {
  return (
    <div class="transaction-list">
      <table>
        <Show when={props.transactions.length}>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Merchant</th>
            <th>Hide</th>
          </tr>
          <For each={props.transactions}>
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
                  <td>{transaction.category.join(",")}</td>
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
                    ></button>
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
                    ></button>
                  </td>
                </tr>
              );
            }}
          </For>
        </Show>
      </table>
    </div>
  );
};
export default TransactionList;
