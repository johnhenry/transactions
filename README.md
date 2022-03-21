# Transactions

- [Transactions](#transactions)
  - [Backend Application](#backend-application)
    - [Interface](#interface)
    - [Requirements](#requirements)
    - [Local Backend via Deno (Option 1)](#local-backend-via-deno-option-1)
    - [Remote Backend (Option 2)](#remote-backend-option-2)
  - [Frontend Application](#frontend-application)
    - [Interface](#interface-1)
    - [Requirements](#requirements-1)
    - [Run Locally](#run-locally)
    - [Build Static](#build-static)

This is an application that allows currly-haired Faris to manage transactions in 2029.

It exists in two parts: a backend built for [deno](https://deno.land) with a graphQL API and a frontend built primarily using [solidjs](https://solidjs.com).

There is an instance of the backend hosted [here](https://afraid-spider-69.deno.dev/graphql).

There is an instance of the frontend hosted [here](https://transactions-b.vercel.app/).

## Backend Application

### Interface

The backend application has a standard GraphQL interface with the following schema:

```typescript
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
```

### Requirements

To run the backend locally, you'll need to install [deno](https://deno.land). Alternatively, backend can also be run remotely using a free account on [deno.com](https://deno.com).

Additionally, you'll need remote access to an instance of a Mongo DB. You can set up a free one by following [these instructions](https://www.mongodb.com/developer/article/getting-started-deno-mongodb/#setting-up-the-mongodb-data-api). Take Note of your **DATA_API_KEY** and your **APP_ID**.

### Local Backend via [Deno](https://deno.land/) (Option 1)

Create a file in the root directory called `.env` and add the following lines:

```she
APP_ID=<your app id>
DATA_API_KEY=<your data api key>
```

replacing the values with your own.

Export the environment variables via

```sh
export $(cat .env)
```

Run the server with.

```sh
run `deno run --allow-net --allow-env backend/index.tsx`
```

the server will be accessible at `http://localhost:8080/graphql`

### Remote Backend (Option 2)

This backend can be run remotely on [Deno.com](https://deno.com/). Simply create a project point it to the `backend/index.ts` file on github. Alternatively, you can run `deno bundle backend/index.ts` and paste the resulting text directly into a "playground".

Be sure to set your **DATA_API_KEY** and your **APP_ID** environment variables appropriately for the project.

the server will be accessible at `https://<your project name>deno.dev/graphql`

## Frontend Application

### Interface

The application is split into three main components:

- Using the "New Transaction form" component, Faris can add to a list of Transactions.

- Using the "Transaction List" component Faris can view a list of transactions, hide and show them, and mark them as "Bezos companies".

- Using the Totals Counter component, Faris can view the total amount of money spent vs the total amount spent on Bezos companies.

### Requirements

To Build and run the frontend locally, you'll need to install the following dependencies: [node/npm](https://nodejs.org/en/download/)

You will also need a running instance of the backend (see above) running. Set this as the "DEFAULT_URI" variable in the `src/settings.js` file. By default, this is set to `https://afraid-spider-68.deno.dev/graphql`.

### Run Locally

Install dependencies via the command `npm install`.

Run the project locally via the command `npm run start:frontend`.

### Build Static

Ensure dependencies are installed via the command `npm install`.

Build the static site via the command `npm run build`. This will create a directory named `dist` that can be served on any static webserver.
