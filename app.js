var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
var logger = require("morgan");

//Passport
const passport = require("passport");
//const authenticate = require("./authenticate");

//token
const config = require("./config");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

var app = express();
//routes to promotion, partner and campsites
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");

const mongoose = require("mongoose");

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const session = require("express-session");
// const FileStore = require("session-file-store")(session);
//app.use(cookieParser("12345-67890-09876-54321"));
//app.use session is a middleware
// app.use(
//   session({
//     name: "session-id",
//     secret: "12345-67890-09876-54321",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());
//pssport

app.use("/", indexRouter);
app.use("/users", usersRouter);
// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//     const err = new Error("You are not authenticated!");
//     err.status = 401;
//     return next(err);
//   } else {
//     if (req.session.user === "authenticated") {
//       return next();
//     } else {
//       const err = new Error("You are not authenticated!");
//       err.status = 401;
//       return next(err);
//     }
//   }
// }

//Passport function
// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     const err = new Error("You are not authenticated!");
//     err.status = 401;
//     return next(err);
//   } else {
//     return next();
//   }
// }

// function auth(req, res, next) {
//   //console.log(req.headers);
//   console.log(req.session);
//   //if (!req.signedCookies.user)
//   if (!req.session.user) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       const err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       return next(err);
//     }

//     const auth = Buffer.from(authHeader.split(" ")[1], "base64")
//       .toString()
//       .split(":");

//     const user = auth[0];
//     const pass = auth[1];
//     if (user === "admin" && pass === "password") {
//       //res.cookie("user", "admin", { signed: true });
//       req.session.user = "admin";
//       return next(); // authorized
//     } else {
//       const err = new Error("You are not authenticated!");
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       return next(err);
//     }
//   } else {
//     //if (req.signedCookies.user === "admin")
//     if (req.session.user === "admin") {
//       return next();
//     } else {
//       const err = new Error("You are not authenticated!");
//       err.status = 401;
//       return next(err);
//     }
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, "public")));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//app user for campsite router

app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
