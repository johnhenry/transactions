import type { Component } from "solid-js";
/* @refresh reload */

import "./index.css";
import { createGraphQLClient, gql } from "@solid-primitives/graphql";
import { createSignal, Show, createEffect } from "solid-js";
import TransactionList from "./TransactionList";
import NewTransactionForm from "./NewTransactionForm";
import HorizontalBar from "./HorizontalBar";

import { DEFAULT_URI } from "./settings.js";

const App: Component = () => {
  const [URI, updateURI] = createSignal(DEFAULT_URI);
  const [total, updateTotal] = createSignal(0);
  const [bTotal, updateBTotal] = createSignal(0);
  const [percentage, setPercentage] = createSignal(`NaN%`);

  const [showHidden, updateShowHidden] = createSignal(false);
  const clientResource = createGraphQLClient(URI());
  const [data, { refetch }] = clientResource(
    gql`
      query {
        specials
        transactions {
          amount
          category
          date
          merchant_name
          _id
          hidden
        }
      }
    `,
    undefined,
    { specials: [], transactions: [] }
  );
  const Ts = () => {
    return showHidden()
      ? data().transactions
      : data().transactions.filter((transaction: any) => !transaction.hidden);
  };
  const Ss = () => {
    return new Set(data().specials);
  };

  createEffect(() => {
    updateTotal(
      Ts().reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0)
    );
    updateBTotal(
      Ts()
        .filter((transaction) => {
          return Ss().has(transaction.merchant_name);
        })
        .reduce((acc, curr) => {
          return acc + curr.amount;
        }, 0)
    );
    setPercentage(`${((bTotal() / total()) * 100).toFixed(2)}%`);
  });

  return (
    <>
      <div class="application">
        <header>
          <div class="logo"> Faris's Transactions</div>
          <div style={{ "margin-left": "auto" }}></div>
        </header>
        <NewTransactionForm refetch={refetch} />
        <div>
          <p>
            Bezos related transactions are colored{" "}
            <span class="bezos-colored">red</span> and account for{" "}
            <span class="bezos-colored">${bTotal().toFixed(2)}</span> of the
            total <span>${total().toFixed(2)}</span> spent.
          </p>
          <p>
            This accounts for <HorizontalBar percentage={percentage()} /> of all
            transactions
          </p>
          <p>
            Add or remove a company from the list of Jeff Bezos related
            companies using <span style="fontweight:bold">+</span> or{" "}
            <span style="fontweight:bold">-</span> next to the Merchant's name.
          </p>
          <p>Hidden transactions are only included in totals when shown.</p>
          <p>
            Show Hidden Transactions{" "}
            <input
              type="checkbox"
              onInput={(event) => {
                updateShowHidden(event.target.checked);
              }}
            />
          </p>
          <Show when={showHidden()}>
            <p>
              Hidden transactions Have a{" "}
              <span class="not-showing">grey bakckground</span>.
            </p>
          </Show>
        </div>
        <TransactionList
          specials={Ss()}
          transactions={Ts()}
          refetch={refetch}
        />
      </div>
    </>
  );
};

export default App;
