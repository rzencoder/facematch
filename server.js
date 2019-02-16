const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const helmet = require("helmet");
const expressValidator = require("express-validator");
const redis = require("redis");
const path = require("path");
require("dotenv").config();

const register = require("./src/controllers/register");
const signIn = require("./src/controllers/signIn");
const image = require("./src/controllers/image");
const profile = require("./src/controllers/profile");
const auth = require("./src/middleware/authorization");
const signOut = require("./src/controllers/signOut");

//CORS options
const whitelist = ["htt", "http://example2.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(expressValidator());

//Redis DB for session management
const client = redis.createClient({
  host: "localhost"
});

//Postgres DB
const devdb = {
  host: "127.0.0.1",
  user: "postgres",
  password: "testa",
  database: "face-match"
};

// const db = {
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// }

// const prodDB = {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true
// }

const knex = require("knex")({
  client: "pg",
  connection: devdb
});

//Routes

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/signin", (req, res) =>
  signIn.signinAuth(req, res, knex, bcrypt, client)
);
app.post("/register", (req, res) =>
  register.handleRegister(req, res, knex, bcrypt, client)
);
app.get("/profile/:id", auth.requireAuth(client), (req, res) =>
  profile.handleGetProfile(req, res, knex)
);
app.post("/profile/:id", auth.requireAuth(client), (req, res) =>
  profile.handleProfileUpdate(req, res, knex)
);
app.delete("/delete_profile/:id", auth.requireAuth(client), (req, res) =>
  profile.handleDeleteProfile(req, res, knex)
);
app.put("/image", auth.requireAuth(client), (req, res) =>
  image.handleImage(req, res, knex)
);
app.post("/imageurl", auth.requireAuth(client), (req, res) =>
  image.handleApiCall(req, res)
);
app.delete("/signout", auth.requireAuth(client), (req, res) =>
  signOut.handleSignOut(req, res, client)
);

app.listen(8080, () => {
  console.log(`app is running on port ${8080}`);
  console.log(process.env.NODE_ENV)
});