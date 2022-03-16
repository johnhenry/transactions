import type { Component } from "solid-js";
import { Show, For } from "solid-js";
const TransactionList: Component = (props: {
  transactions: [];
  specials: Set;
  showHidden: boolean;
}) => {
  return (
    <table>
      <Show when={props.transactions.length}>
        <tr>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Merchant</th>
          <th>Hide</th>
        </tr>
        <For
          each={
            props.showHidden
              ? props.transactions
              : props.transactions.filter(
                  (transaction: any) => !transaction.hidden
                )
          }
        >
          {(transaction: any) => (
            <tr
              classList={{
                transaction: true,
                bezos: props.specials.has(transaction.merchant_name),
                hidden: transaction.hidden,
              }}
            >
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
              <td>{transaction.date}</td>
              <td>
                {transaction.merchant_name}{" "}
                <button classList={{ bezoslist: true }}></button>
              </td>
              <td>
                <button classList={{ hide: true }}></button>
              </td>
            </tr>
          )}
        </For>
      </Show>
    </table>
  );
};
export default TransactionList;
