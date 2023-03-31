import express from 'express';
//express async errors must be imported near after express import and must have single quotes
import 'express-async-errors';
import cors from "cors";
import morgan from "morgan";
import mongoose from 'mongoose';
import v1 from "./versions/v1/router.js";

mongoose.connect(process.env.DB || "mongodb://localhost:27017/ssps", {
}).then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use("/api/v1", v1);

export default app;