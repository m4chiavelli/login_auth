import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routers/UserRoute.js";
import ProductRoute from "./routers/ProductRoute.js";
import AuthRoute from "./routers/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/koneksi.js";
// import argon2 from "argon2";
// import mysql from "mysql2";
// import sequelize from "sequelize";

dotenv.config();

// middleware
const app = express();

// const store = new SequelizeStore(session.Store)({
//   db: db,
//   checkExpirationInterval: 1000,
//   expiration: 10000,
//   max: 10,
//   min: 0,
//   idle: 10000,
// });
const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
    store: store,
  })
);

app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// eksekusi database
// (async () => {
//   await db.sync();
// })();

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
