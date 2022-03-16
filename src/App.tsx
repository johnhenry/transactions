import type { Component } from "solid-js";
/* @refresh reload */
import "./index.css";
import { createGraphQLClient, gql } from "@solid-primitives/graphql";
import { createSignal } from "solid-js";
import TransactionList from "./TransactionList";
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
  setInterval(() => {
    refetchTransactions();
  }, 5000);
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
      <TransactionList
        specials={new Set(specials().specials)}
        transactions={transactions().transactions}
        showHidden={showHidden()}
        refetchSpecials={refetchSpecials}
        refetchTransactions={refetchTransactions}
      />
    </>
  );
};

export default App;
