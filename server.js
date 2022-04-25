const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const createError = require("http-errors");
const logEvents = require("./Helpers/logEvents");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

require("./Helpers/connections_multi_mongodb").mongooseTutorial;

const app = express();

const userRoute = require("./Routes/User.route");
const store = session.MemoryStore();

app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    saveUninitialized: false,
    secret: "ABC",
    cookie: {
      maxAge: 1000 * 10,
    },
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(`username passport: ${username}, password: ${password}`);
    if (username === "Quytp2@gmail.com") {
      return done(null, {
        username,
        password,
        active: true,
      });
    }
    return done(null, false);
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((username, done) => {
  console.log(`Username::: ${username}`);
  if (username === "Quytp2@gmail.com") {
    return done(null, {
      username,
      password,
      active: true,
    });
  }
  return done(null, false);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running" + PORT);
});

app.use("/v1/users", userRoute);

app.use((req, res, next) => {
  logEvents(`${req.url} ----- ${req.method} ----- Not Found`);
  next(
    createError(404, {
      message: "Not Found",
      links: {
        docs: "https://doc.com/api",
      },
    })
  );
});

app.use((err, req, res, next) => {
  logEvents(`${req.url} ----- ${req.method} ----- ${err.message}`);
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
    links: {
      docs: "https://doc.com/api",
    },
  });
});
