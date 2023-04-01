import mongoose from "mongoose"
import User from "../models/user"
async function getUser(id){
    return await User.findById(id);
}