import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import requestLoggerMiddleware from "./middlewares/requestLogger.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { ApiError } from "./utils/ApiError.js";
import router from "./routes/index.js";
import morgan from "morgan";
import chalk from "chalk";

const app = express();
const corsConfig = cors({
    origin: "*",
    credentials: true,
});
app.set('trust proxy', true);

// Use morgan to log requests with colors
app.use(morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const statusColor = status >= 400 ? chalk.red : chalk.green;

    return [
        chalk.bold(statusColor(tokens.method(req, res))),
        "  ==>>  ",
        chalk.bold(tokens.url(req, res)),
        chalk.bold(statusColor(status)),
        chalk.bold(tokens.res(req, res, "content-length")), "-",
        chalk.bold(tokens["response-time"](req, res)), "ms"
    ].join(" ");
}));
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(requestLoggerMiddleware);

app.get("/", (req, res) => {
    if (req.body.demoError) {
        throw new ApiError("error response demo", 409);
    }
    const response = new ApiResponse(
        200,
        null,
        "this is the home route of employees-crud"
    );
    res.status(200).send(response);
});

app.use("/api", router);

app.use(errorHandler);

export { app };
