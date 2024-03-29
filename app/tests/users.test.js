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
    walletAddress: "0xC216dB1b18B44Cb157CF116e1e0cD2b785f54564",
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
    walletAddress: "0xC216dB1b18B44Cb157CF116e1e0cD2b785f54565",
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
    walletAddress: "0xC216dB1b18B44Cb157CF116e1e0cD2b785f54566",
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
    walletAddress: "0xC216dB1b18B44Cb157CF116e1e0cD2b785f54567",
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
    walletAddress: "0xC216dB1b18B44Cb157CF116e1e0cD2b785f54568",
  },
];

let testingUsersId = [];

const createTestingUsers = async (users) => {
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
  await createTestingUsers(testingUsers);
});

afterAll(async () => {
  await testingDb.dropTestDbDatabase();
});

describe("GET /user/", () => {
  it("Check if it filter by role", async () => {
    const response = await request(app)
      .get("/user/")
      .query({ role: "Listener" });
    const response2 = await request(app)
      .get("/user/")
      .query({ role: "Artist" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(3);
    expect(response2.status).toEqual(200);
    expect(response2.body.data).toHaveLength(1);
  });

  it("Check if it filter by email", async () => {
    const response = await request(app)
        .get("/user/")
        .query({ email: "mail3@gmail.com" });

    expect(response.status).toEqual(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].email).toEqual("mail3@gmail.com");
  });

  it("Check if it filter by name", async () => {
    const response = await request(app).get("/user/").query({ name: "Nombre" });
    const response2 = await request(app).get("/user/").query({ name: "Nom" });
    const response3 = await request(app).get("/user/").query({ name: "nom" });

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
  });
});

describe("GET /user/:uid", () => {
  it("Check if it returns the user correctly", async () => {
    const response = await request(app).get("/user/8723498573nwf");

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual(testingUsers[0].name);
  });

  it("Check error when passing non existen uid", async () => {
    const response = await request(app).get(`/user/527f1f77bcf86cd799439012`);
    expect(response.status).toEqual(404);
  });
});

describe("PATCH /user/:uid", () => {
  it("Changes the name", async () => {
    const newName = "Roberto";
    const response = await request(app).patch("/user/8723498573nwf").send({
      name: newName,
    });

    expect(response.status).toEqual(204);
    const user = await request(app).get("/user/8723498573nwf");
    expect(user.body.name).toEqual(newName);
    expect(user.body.surname).toEqual("Apellido 1");
  });
});
