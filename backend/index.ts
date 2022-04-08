//@ts-ignore
import { Application } from "https://deno.land/x/oak/mod.ts";
//@ts-ignore
import log from "https://johnhenry.github.io/lib/js/log-dictionary/0.0.0/index.mjs";
//@ts-ignore
import CreateCORSMiddleware from "https://johnhenry.github.io/lib/js/cors-helper/0.0.0/oak-middleware.mjs";
//@ts-ignore
import { PORT } from "./settings.ts";
//@ts-ignore
import router from "./graphQLRouter/index.ts";
const CORS = CreateCORSMiddleware();
const app: Application = new Application().use(
  CORS,
  router.routes(),
  router.allowedMethods()
);
app.addEventListener("listen", log);
await app.listen({ port: PORT as number });
