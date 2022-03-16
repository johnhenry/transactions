import type { Component } from "solid-js";
/* @refresh reload */
import "./index.css";
import { createGraphQLClient, gql } from "@solid-primitives/graphql";
import { createSignal } from "solid-js";
import TransactionList from "./TransactionList";
import NewTransactionForm from "./NewTransactionForm";

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
      <TransactionList
        specials={new Set(specials().specials)}
        transactions={transactions().transactions}
        showHidden={showHidden()}
        refetch={refetch}
      />
    </>
  );
};

export default App;
