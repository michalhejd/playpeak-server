import mongoose from "mongoose";
import Error from "../models/Error.js";

export function saveErrorToDabase(err, time) {
    const newError = new Error({
        error: err,
        dateOfError: time
    });
    newError.save()
    return
}