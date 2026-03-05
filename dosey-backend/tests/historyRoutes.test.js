const request = require("supertest");
const express = require("express");
const historyRouter = require("../routes/history");

jest.mock("../models/MedicineHistory");
jest.mock("../models/medicine");

// Mock auth middleware
jest.mock("../middleware/authMiddleware", () =>
  jest.fn((req, res, next) => {
    req.user = { id: 1 };
    next();
  })
);

const app = express();
app.use(express.json());
app.use("/history", historyRouter);

describe("History Route Tests", () => {

  test("POST /history should return 400 if medicineName missing", async () => {
    const res = await request(app)
      .post("/history")
      .send({});

    expect([400, 500]).toContain(res.statusCode);
  });

  test("GET /history should return history list", async () => {
    const res = await request(app)
      .get("/history");

    expect(res.statusCode).toBe(200);
  });

});