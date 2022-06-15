const testingDb = require("../services/dbTesting");
const User = require("../models/userModel");
const userRouter = require("../routes/userRoutes");
const errorHandlerMiddleware = require("../middleware/errorHandler");

const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/user", userRouter);

app.use(errorHandlerMiddleware);

const testingUsers = [
    {
        uid: "8723498573nwf",
        email: "mail1@gmail.com",
        role: "Listener",
        disabled: false,
        name: "Nombre 1",
        surname: "Apellido 1",
        birthdate: null,
        plan: "Free",
    },
    {
        uid: "8723fw98573nwf",
        email: "mail2@gmail.com",
        role: "Listener",
        disabled: false,
        name: "Name 2",
        surname: "Apellido 2",
        birthdate: null,
        plan: "Premium",
    },
    {
        uid: "87233d221573nwf",
        email: "mail3@gmail.com",
        role: "Artist",
        disabled: false,
        name: "Prenom 3",
        surname: "Apellido 3",
        birthdate: null,
        plan: "Free",
    },
    {
        uid: "87237999998573nwf",
        email: "mail4@gmail.com",
        role: "Listener",
        disabled: true,
        name: "Nombre 4",
        surname: "Apellido 4",
        birthdate: null,
        plan: "Premium",
    },
    {
        uid: "872kks98573nwf",
        email: "mail5@gmail.com",
        role: "Admin",
        disabled: false,
        name: "Name 5",
        surname: "Apellido 5",
        birthdate: null,
        plan: "Free",
    },
]

let testingUsersId = []

const createTestingSongs = async (users) => {
    for (const user of users) {
        const newUser = new User(user);
        await newUser.save();
        testingUsersId.push(newUser.id);
    }
};

beforeAll(async () => {
    await testingDb.setUpTestDb();
    await testingDb.dropTestDbCollections();
});

beforeEach(async () => {
    await testingDb.dropTestDbCollections();
    testingUsersId = [];
    await createTestingSongs(testingUsers);
});

afterAll(async () => {
    await testingDb.dropTestDbDatabase();
});

describe("GET /user/", () => {
    it("Check if it filter by role", async () => {
        const response = await request(app).get("/user/").query({role: "Listener"});
        const response2 = await request(app).get("/user/").query({role: "Artist"});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(3);
        expect(response2.status).toEqual(200);
        expect(response2.body.data).toHaveLength(1);
    });

    it("Check if it filter by name", async () => {
        const response = await request(app).get("/user/").query({name: "Nombre"});
        const response2 = await request(app).get("/user/").query({name: "Nom"});
        const response3 = await request(app).get("/user/").query({name: "nom"});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(2);
        expect(response2.status).toEqual(200);
        expect(response2.body.data).toHaveLength(3);
        expect(response3.status).toEqual(200);
        expect(response3.body.data).toHaveLength(3);
    });

    it("Check if returns everything when no filter is supplied", async () => {
        const response = await request(app).get("/user/");

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(5);
    })
});

describe("GET /user/:uid", () => {
   it("Check if it returns the user correctly", async () => {
       const response = await request(app).get("/user/8723498573nwf");

       expect(response.status).toEqual(200);
       expect(response.body.data.name).toEqual(testingUsers[0].name);
   });

    it("Check error when passing non existen uid", async () => {
        const response = await request(app).get(`/user/527f1f77bcf86cd799439012`)
        expect(response.status).toEqual(404);
    });
});