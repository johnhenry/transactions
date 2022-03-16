import type { Component } from "solid-js";
/* @refresh reload */
import "./index.css";
import { createGraphQLClient, gql } from "@solid-primitives/graphql";
import { createSignal } from "solid-js";
import TransactionList from "./TransactionList";
// const DEFAULT_URI = "https://low-hawk-86.deno.dev/graphql";
const DEFAULT_URI = "http://localhost:8080/graphql";
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
      />
    </>
  );
};

export default App;
