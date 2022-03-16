import type { Component } from "solid-js";
/* @refresh reload */
import "./index.css";
import { createGraphQLClient, gql } from "@solid-primitives/graphql";
import { createSignal } from "solid-js";
// const DEFAULT_URI = "https://low-hawk-86.deno.dev/graphql";
const DEFAULT_URI = "http://localhost:8080/graphql";
const App = () => {
  const [URI, updateURI] = createSignal(DEFAULT_URI);
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
      <div>specials: {JSON.stringify(specials().specials)}</div>
      <div>transactions: {JSON.stringify(transactions().transactions)}</div>
    </>
  );
};

export default App;
