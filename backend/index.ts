import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
const APP_ID = Deno.env.get("APP_ID");
const DATA_API_KEY = Deno.env.get("DATA_API_KEY");
assertEquals(APP_ID, "1");
assertEquals(DATA_API_KEY, "2");
