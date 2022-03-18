// Route that blanketly enables CORS headers for all requests
export default async (
  { request, response }: any,
  next: Function
): Promise<void> => {
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
};
