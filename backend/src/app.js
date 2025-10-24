const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const xss = require("xss");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");

const app = express();
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again after a minute",
});

// Middlewares
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      return xss(obj);
    }
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

app.use((err, req, res, next) => {
  console.log("Returing.....");
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
