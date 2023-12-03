import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import session from "express-session";
import UserRoute from "./routes/UserRoute.js";
import ReportRoute from "./routes/ReportRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(UserRoute);
app.use(ReportRoute);
app.use(AuthRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});
