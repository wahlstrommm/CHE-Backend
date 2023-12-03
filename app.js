var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var openingRoutines = require("./routes/opening-routines");
var closingRoutines = require("./routes/closing-routines");
var summaryRoutines = require("./routes/summary-routines");
var weeklyRoutines = require("./routes/weekly-routines");
var uploadRoute = require("./routes/upload");
var specialRoute = require("./routes/special-routines");

var app = express();
var cors = require("cors");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/opening-routines", openingRoutines);
app.use("/closing-routines", closingRoutines);
app.use("/summary", summaryRoutines);
app.use("/upload", uploadRoute);
app.use("/weekly-routines", weeklyRoutines);
app.use("special-routines");
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
