//@ts-ignore
import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export default gql`
  type Success {
    success: Boolean
  }

  type Transaction {
    amount: Float
    category: [String]
    date: String
    merchant_name: String
    hidden: Boolean
    _id: String
  }

  type Query {
    specials: [String]
    transactions: [Transaction]
  }
  type Mutation {
    addTransaction(
      amount: Float
      category: [String]
      date: String
      merchant_name: String
    ): Transaction
    hideTransaction(_id: String): Success
    showTransaction(_id: String): Success
    addSpecial(special: String): Success
    removeSpecial(special: String): Success
  }
`;
