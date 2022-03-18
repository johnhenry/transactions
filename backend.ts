//@ts-ignore
import { Router, Application } from "https://deno.land/x/oak/mod.ts";
// @ts-ignore
import { applyGraphQL, gql } from "https://deno.land/x/oak_graphql/mod.ts";

declare const Deno: {
  env: { get: Function };
};
const APP_ID = Deno.env.get("APP_ID");
const DATA_API_KEY = Deno.env.get("DATA_API_KEY");
const DATA_SOURCE = "Cluster0";
const DATABASE = "transaction_db";
const PORT = 8080;
const CreateMongoDBQuery =
  ({
    APP_ID,
    DATA_API_KEY,
    COLLECTION,
    DATABASE,
    DATA_SOURCE,
  }: {
    APP_ID: string;
    DATA_API_KEY: string;
    COLLECTION: string;
    DATABASE: string;
    DATA_SOURCE: string;
  }) =>
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

interface Success {
  success: Boolean;
}

type Transaction = {
  amount: Number;
  category: [String];
  date: String;
  merchant_name: String;
  hidden: Boolean;
  _id: String;
};

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
    async transactions(): Promise<Transaction[]> {
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
    async specials(): Promise<String[]> {
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
      _: any,
      {
        amount,
        category,
        date,
        merchant_name,
      }: {
        amount: Number;
        category: String[];
        date: String;
        merchant_name: String;
      }
    ): Promise<Transaction> {
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
        return {
          _id: "",
          amount: 0,
          category: [""],
          date: "",
          hidden: false,
          merchant_name: "",
        };
      }
    },
    async hideTransaction(_: any, { _id }: { _id: String }): Promise<Success> {
      try {
        const dataResponse = await transactionQuery("updateOne", {
          filter: { _id: { $oid: _id } },
          update: {
            $set: { hidden: true },
          },
        });

        const res = await dataResponse.json();
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    async showTransaction(_: any, { _id }: { _id: String }): Promise<Success> {
      try {
        const dataResponse = await transactionQuery("updateOne", {
          filter: { _id: { $oid: _id } },
          update: {
            $set: { hidden: false },
          },
        });
        const { document } = await dataResponse.json();
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    async addSpecial(
      _: any,
      { special }: { special: String }
    ): Promise<Success> {
      try {
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
        const { document } = await dataResponse.json();
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    async removeSpecial(
      _: any,
      { special }: { special: String }
    ): Promise<Success> {
      try {
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
        const { document } = await dataResponse.json();
        return { success: true };
      } catch {
        return { success: false };
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

const serverStartListener = (event: Event): void => {
  log("started:", new Date().toString());
  for (const [key, value] of Object.entries(event)) {
    log(`${key}:`, value);
  }
};

const app = new Application().use(
  async ({ request, response }: any, next: Function): Promise<void> => {
    if (request.method === "OPTIONS") {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
      );
      response.body = "";
    } else {
      await next();
      const origin = String(request.headers.get("origin"));
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
  },
  GraphQLRouter.routes(),
  GraphQLRouter.allowedMethods()
);

app.addEventListener("listen", serverStartListener);
await app.listen({ port: PORT });
