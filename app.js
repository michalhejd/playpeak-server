import express from 'express';
import cors from "cors";
import morgan from "morgan";
//import mongoose from 'mongoose';
import v1 from "./versions/v1/router.js";

/*mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB || "mongodb://localhost:27017/ssps", () =>{
    console.log("Connected to DB");
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
*/
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use("/api/v1", v1);

export default app;