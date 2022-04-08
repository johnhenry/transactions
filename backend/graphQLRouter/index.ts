//@ts-ignore
import { Router } from "https://deno.land/x/oak/mod.ts";
// @ts-ignore
import { applyGraphQL } from "https://deno.land/x/oak_graphql/mod.ts";
//@ts-ignore
import typeDefs from "./typeDefs.ts";
//@ts-ignore
import resolvers from "./resolvers/index.ts";
const GraphQLRouter: Router = await applyGraphQL({
  Router,
  typeDefs,
  resolvers,
});
export default GraphQLRouter;
