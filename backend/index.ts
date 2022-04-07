//@ts-ignore
import { Router, Application } from "https://deno.land/x/oak/mod.ts";
// @ts-ignore
import { applyGraphQL } from "https://deno.land/x/oak_graphql/mod.ts";
//@ts-ignore
import { PORT } from "./settings.ts";
//@ts-ignore
import typeDefs from "./typeDefs.ts";
//@ts-ignore
import resolvers from "./resolvers/index.ts";
//@ts-ignore
import CORSRoute from "./CORSRoute.ts";
//@ts-ignore
import printEvent from "./printEvent.ts";
const GraphQLRouter: Router = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
});
const app: Application = new Application().use(
  CORSRoute,
  GraphQLRouter.routes(),
  GraphQLRouter.allowedMethods()
);
app.addEventListener("listen", printEvent);
await app.listen({ port: PORT as number });
