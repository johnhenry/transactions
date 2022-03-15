import { Router, Application } from "https://deno.land/x/oak/mod.ts";
const APP_ID = Deno.env.get("APP_ID");
const DATA_API_KEY = Deno.env.get("DATA_API_KEY");
const DATA_SOURCE = "Cluster0";
const DATABASE = "transaction_db";

const PORT = 8080;

const CreateMongoDBQuery =
  ({ APP_ID, DATA_API_KEY, COLLECTION, DATABASE, DATA_SOURCE }: any) =>
  (path: string, fields: object) => {
    return fetch(
      `https://data.mongodb-api.com/app/${APP_ID}/endpoint/data/beta/action/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": DATA_API_KEY,
        },
        body: JSON.stringify({
          collection: COLLECTION,
          database: DATABASE,
          dataSource: DATA_SOURCE,
          ...fields,
        }),
      }
    );
  };

const transactionQuery = CreateMongoDBQuery({
  APP_ID,
  DATA_API_KEY,
  DATA_SOURCE,
  DATABASE,
  COLLECTION: "transaction_list",
});

const specialQuery = CreateMongoDBQuery({
  APP_ID,
  DATA_API_KEY,
  DATA_SOURCE,
  DATABASE,
  COLLECTION: "special_list",
});

import { applyGraphQL, gql } from "https://deno.land/x/oak_graphql/mod.ts";
const typeDefs = gql`
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

const resolvers = {
  Query: {
    async transactions() {
      const dataResponse = await transactionQuery("find", {});
      try {
        const { documents } = await dataResponse.json();
        if (documents) {
          return documents;
        }
      } catch {
        return [];
      }
      return [];
    },
    async specials() {
      const dataResponse = await specialQuery("findOne", {
        filter: { name: "specials" },
      });
      try {
        const { document } = await dataResponse.json();
        return document.special || [];
      } catch {
        return [];
      }
      return [];
    },
  },
  Mutation: {
    async addTransaction(
      parent: any,
      { amount, category, date, merchant_name }: any
    ) {
      const dataResponse = await transactionQuery("insertOne", {
        document: {
          amount,
          category,
          date,
          merchant_name,
        },
      });
      try {
        const { document } = await dataResponse.json();
        return document;
      } catch {
        return {};
      }
    },
    async hideTransaction(parent: any, { _id }: any) {
      const dataResponse = await transactionQuery("updateOne", {
        filter: { _id: { $oid: _id } },
        update: {
          $set: { hidden: true },
        },
      });
      try {
        const res = await dataResponse.json();
        return res.document;
      } catch {
        return {};
      }
    },
    async showTransaction(parent: any, { _id }: any) {
      const dataResponse = await transactionQuery("updateOne", {
        filter: { _id: { $oid: _id } },
        update: {
          $set: { hidden: false },
        },
      });
      try {
        const { document } = await dataResponse.json();
        return document;
      } catch {
        return {};
      }
    },
    async addSpecial(parent: any, { special }: any) {
      const specials = (await resolvers.Query.specials()) || [];
      if (!specials.includes(special)) {
        specials.push(special);
      }
      const dataResponse = await specialQuery("updateOne", {
        filter: { name: "specials" },
        update: {
          $set: { special: specials },
        },
        upsert: true,
      });
      try {
        const { document } = await dataResponse.json();
        return document;
      } catch {
        return {};
      }
    },
    async removeSpecial(
      parent: any,
      { special }: any,
      context: any,
      info: any
    ) {
      const specials = (await resolvers.Query.specials()) || [];
      if (specials.includes(special)) {
        const index = specials.indexOf(special);
        specials.splice(index, 1);
      }
      const dataResponse = await specialQuery("updateOne", {
        filter: { name: "specials" },
        update: {
          $set: { special: specials },
        },
        upsert: true,
      });
      try {
        const { document } = await dataResponse.json();
        return document;
      } catch {
        return {};
      }
    },
  },
};

const GraphQLRouter = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
});

// ////////////////
// Application
// ////////////////
const { log } = console;

const serverStartListener = (event: Event) => {
  log("started:", new Date().toString());
  for (const [key, value] of Object.entries(event)) {
    log(`${key}:`, value);
  }
};

const app = new Application().use(
  async (context, next) => {
    if (context.request.method === "OPTIONS") {
      context.response.headers.set("Access-Control-Allow-Origin", "*");
      context.response.headers.set("Access-Control-Allow-Credentials", "true");
      context.response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT"
      );
      context.response.headers.set(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
      );
      context.response.body = "";
    } else {
      await next();
      const origin = String(context.request.headers.get("origin"));
      context.response.headers.set("Access-Control-Allow-Origin", origin);
    }
  },
  GraphQLRouter.routes(),
  GraphQLRouter.allowedMethods()
);

app.addEventListener("listen", serverStartListener);
await app.listen({ port: PORT });
