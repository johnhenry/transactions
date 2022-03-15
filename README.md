# Transactions

## Backend Application

### Mongo DB API

The backend application requires access to a MongoDB Rest.
You can set up a free one by following [these instructions](https://www.mongodb.com/developer/article/getting-started-deno-mongodb/#setting-up-the-mongodb-data-api).
Take Note of your DATA_API_KEY and your APP_ID.

### Local Backend (Option 1)

This backend can be run locally via [Deno](https://deno.land/).

After installing deno create a file called `backend/.env` and add the following lines:

```
APP_ID=<your app id>
DATA_API_KEY=<your data api key>
```

replacing the values with your own.

export the environment variables via

```sh
export $(cat .env)
```

run the server

```sh
run `deno run --allow-net --allow-env backend/index.tsx`
```

the server will be accessible at `http://localhost:8000/graphql`

### Remote Backend (Option 2)

This backend can be run remotely on [Deno.com](https://deno.com/).

Login via github and creae a new app pointing at the raw github file: https://raw.githubusercontent.com/johnhenry/transactions/main/backend/index.ts

(Alternatively, you can crate a "playground" and paste the code directly from /backend/index.ts)

Be sure to set your DATA_API_KEY and your APP_ID environment variables appropriately for the project.

The backend may be run either locally using [Deno](https://deno.land)
or remotely on

The backend application requires [Deno](https://deno.land) to be installed.

the server will be accessible at `https://<your project name>deno.dev/graphql`
