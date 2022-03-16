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
  const [specials, { refetch: refetchSpecials }] = clientResource(
    gql`
      query {
        specials
      }
    `,
    undefined,
    { specials: [] }
  );
  const [transactions, { refetch: refetchTransactions }] = clientResource(
    gql`
      query {
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
    { transactions: [] }
  );
  const refetch = async () => {
    await refetchSpecials();
    refetchTransactions();
  };
  // const Ts = showHidden ? transactions().transactions;
  const Ts = () => {
    return showHidden()
      ? transactions().transactions
      : transactions().transactions.filter(
          (transaction: any) => !transaction.hidden
        );
  };
  const Ss = () => {
    return new Set(specials().specials);
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
    <>
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
    </>
  );
};

export default App;
