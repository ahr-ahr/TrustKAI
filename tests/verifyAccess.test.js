process.env.NODE_ENV = "test";

const tap = require("tap");
const buildApp = require("../src/app");

async function createTestApp() {
  const app = buildApp();
  await app.ready();
  return app;
}

tap.test("API key missing", async (t) => {
  const app = await createTestApp();

  const res = await app.inject({
    method: "POST",
    url: "/v1/verify-access",
    payload: { role: "admin" },
  });

  t.equal(res.statusCode, 401);
  t.equal(JSON.parse(res.payload).error, "API_KEY_MISSING");

  await app.close();
});

tap.test("API key invalid", async (t) => {
  const app = await createTestApp();

  const res = await app.inject({
    method: "POST",
    url: "/v1/verify-access",
    headers: { "x-api-key": "invalid-key" },
    payload: { role: "admin" },
  });

  t.equal(res.statusCode, 403);
  t.equal(JSON.parse(res.payload).error, "API_KEY_INVALID");

  await app.close();
});

tap.test("Valid request returns decision structure", async (t) => {
  const app = await createTestApp();

  const res = await app.inject({
    method: "POST",
    url: "/v1/verify-access",
    headers: { "x-api-key": "dev-trustkai-key-123" },
    payload: { role: "admin" },
  });

  const body = JSON.parse(res.payload);

  t.equal(res.statusCode, 200);
  t.type(body.decision, "string");
  t.type(body.risk_score, "number");
  t.type(body.confidence, "string");
  t.ok(Array.isArray(body.reasons));

  await app.close();
});

tap.test("Confidence matches risk score", async (t) => {
  const app = await createTestApp();

  const res = await app.inject({
    method: "POST",
    url: "/v1/verify-access",
    headers: { "x-api-key": "dev-trustkai-key-123" },
    payload: { role: "admin" },
  });

  const { risk_score, confidence } = JSON.parse(res.payload);

  if (risk_score <= 20) t.equal(confidence, "LOW");
  else if (risk_score <= 50) t.equal(confidence, "MEDIUM");
  else t.equal(confidence, "HIGH");

  await app.close();
});
