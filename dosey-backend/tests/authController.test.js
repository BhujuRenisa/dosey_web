const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = require("../controller/authController");
// Mock User model
jest.mock("../models/User");
const User = require("../models/User");

// Mock bcrypt and jwt
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());

// Routes for testing
app.post("/register", authController.register);
app.post("/login", authController.login);

describe("Auth Controller Tests", () => {

    /*
    REGISTER TEST
    */

    test("Should register user successfully", async () => {

        User.findOne.mockResolvedValue(null);

        User.create.mockResolvedValue({
            id: 1,
            fullName: "Test User",
            email: "test@gmail.com"
        });

        bcrypt.hash.mockResolvedValue("hashedpassword");

        const res = await request(app)
            .post("/register")
            .send({
                fullName: "Test User",
                email: "test@gmail.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User created successfully!");
    });

    /*
    LOGIN SUCCESS TEST
\   */

    test("Should login successfully", async () => {

        User.findOne.mockResolvedValue({
            id: 1,
            email: "test@gmail.com",
            password: "hashedpassword",
            fullName: "Test User"
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("fake_token");

        const res = await request(app)
            .post("/login")
            .send({
                email: "test@gmail.com",
                password: "123456"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    /*
    LOGIN FAILURE TEST
    */

    test("Should reject wrong password", async () => {

        User.findOne.mockResolvedValue({
            password: "hashedpassword"
        });

        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
            .post("/login")
            .send({
                email: "test@gmail.com",
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(400);
    });

});