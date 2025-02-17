import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { getHostIpAddress } from "./utils/hostIP.js";
import morgan from "morgan";
import {config} from './config/config.js';
dotenv.config({
    path: "./.env",
});

// Use morgan to log requests
app.use(morgan('combined'));

connectDB()
    .then(() => {
        app.listen(config.port || 5000, "0.0.0.0", () => {
            const host = getHostIpAddress();
            const port = config.port || 5000;
            console.log(`Server is running at Port : ${port}`);
            console.log(`Server is listening at http://${host}:${port}`);

        });
    })
    .catch((err) => {
        console.log("Error While Creating Server!!! : ", err);
    });
