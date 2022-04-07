declare const Deno: {
  env: { get: Function };
};
export const APP_ID: String = Deno.env.get("APP_ID");
export const DATA_API_KEY: String = Deno.env.get("DATA_API_KEY");
export const DATA_SOURCE: String = "Cluster0";
export const DATABASE: String = "transaction_db";
export const PORT: Number = 8080;
