const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const helmet = require("helmet");
const expressValidator = require("express-validator");
const compression = require('compression')
const redis = require("redis");
const path = require("path");
require("dotenv").config();

const register = require("./src/controllers/register");
const signIn = require("./src/controllers/signIn");
const image = require("./src/controllers/image");
const profile = require("./src/controllers/profile");
const auth = require("./src/middleware/authorization");
const signOut = require("./src/controllers/signOut");

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(compression());

//Cors

const whitelist = ["https://desolate-wave-89140.herokuapp.com/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log(origin)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// if (process.env.NODE_ENV === "production") {
//   // app.use(cors(corsOptions));
// } else {

// }

//Redis DB for session management
let client;

if (process.env.NODE_ENV === "production") {
  client = redis.createClient(process.env.REDISCLOUD_URL, {
    no_ready_check: true
  });
} else {
  client = redis.createClient({
    host: process.env.REDIS_HOST
  });
}

//Postgres DB

let pgDatabase;

if (process.env.NODE_ENV === "production") {
  pgDatabase = {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
} else {
  pgDatabase = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
  }
}

const knex = require("knex")({
  client: "pg",
  connection: pgDatabase
});

//Routes

app.get("/", cors(corsOptions), function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/signin", cors(corsOptions), (req, res) =>
  signIn.signinAuth(req, res, knex, bcrypt, client)
);
app.post("/register", cors(corsOptions), (req, res) =>
  register.handleRegister(req, res, knex, bcrypt, client)
);
app.get("/profile/:id", cors(corsOptions), auth.requireAuth(client), (req, res) =>
  profile.handleGetProfile(req, res, knex)
);
app.post("/profile/:id", cors(corsOptions), auth.requireAuth(client), (req, res) =>
  profile.handleProfileUpdate(req, res, knex)
);
app.delete("/delete_profile/:id", cors(corsOptions), auth.requireAuth(client), (req, res) =>
  profile.handleDeleteProfile(req, res, knex)
);
app.put("/image", cors(corsOptions), auth.requireAuth(client), (req, res) =>
  image.handleImage(req, res, knex)
);
app.post("/imageurl", cors(corsOptions), auth.requireAuth(client), (req, res) =>
  image.handleImageApiCall(req, res)
);
app.delete("/signout", cors(corsOptions), auth.requireAuth(client), (req, res) =>
  signOut.handleSignOut(req, res, client)
);

// production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })
}

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
  console.log(process.env.NODE_ENV)
});