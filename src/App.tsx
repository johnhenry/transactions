import type { Component } from "solid-js";
/* @refresh reload */

import "./index.css";
import { createGraphQLClient, gql } from "@solid-primitives/graphql";
import { createSignal } from "solid-js";
import TransactionList from "./TransactionList";
import NewTransactionForm from "./NewTransactionForm";
import TotalsCounter from "./TotalsCounter";

import { DEFAULT_URI } from "./settings.js";

const App: Component = () => {
  const [URI, updateURI] = createSignal(DEFAULT_URI);
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
  const total = () =>
    Ts().reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

  const bTotal = () => {
    const transactions = Ts();
    return transactions
      .filter((transaction) => {
        return Ss().has(transaction.merchant_name);
      })
      .reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);
  };

  return (
    <div class="application">
      <label>
        ShowHidden
        <input
          type="checkbox"
          onInput={(event) => {
            updateShowHidden(event.target.checked);
          }}
        />
      </label>
      <NewTransactionForm refetch={refetch} />
      <TotalsCounter total={total} bTotal={bTotal} />
      <TransactionList specials={Ss()} transactions={Ts()} refetch={refetch} />
    </div>
  );
};

export default App;
