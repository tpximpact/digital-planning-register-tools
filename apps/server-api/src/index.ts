import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// ♥ curl -i -H "Origin: http://localhost:3001" https://api.familyinfo.buckinghamshire.gov.uk/api/v1/services
// HTTP/2 200
// access-control-allow-origin: *
// content-type: application/json; charset=utf-8
// date: Mon, 28 Jul 2025 21:38:33 GMT
// etag: W/"3e45d-lM/rS3KGEka3pfF4OsXEQlot//Q"
// nel: {"report_to":"heroku-nel","response_headers":["Via"],"max_age":3600,"success_fraction":0.01,"failure_fraction":0.1}
// ratelimit-limit: 100
// ratelimit-policy: 100;w=60
// ratelimit-remaining: 96
// ratelimit-reset: 18
// report-to: {"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=j4%2FAuRFf1oyZCAhivXvUadAYkPs19H9oCZC%2F%2FEL2Usk%3D\u0026sid=929419e7-33ea-4e2f-85f0-7d8b7cd5cbd6\u0026ts=1753738713"}],"max_age":3600}
// reporting-endpoints: heroku-nel="https://nel.heroku.com/reports?s=j4%2FAuRFf1oyZCAhivXvUadAYkPs19H9oCZC%2F%2FEL2Usk%3D&sid=929419e7-33ea-4e2f-85f0-7d8b7cd5cbd6&ts=1753738713"
// server: Heroku
// via: 2.0 heroku-router
// x-powered-by: Express
// content-length: 255069

export const app = new Elysia()
  // bug in cors https://github.com/elysiajs/elysia/issues/1308
  .headers({ "Access-Control-Allow-Origin": "*" })
  .use(swagger())
  .get("/", () => "Hi Elysia")
  .get("/id/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Number(),
    }),
  })
  .post("/mirror", ({ body }) => body, {
    schema: {
      body: t.Object({
        id: t.Number(),
        name: t.String(),
      }),
    },
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export const test = "hello world";

export type App = typeof app;
