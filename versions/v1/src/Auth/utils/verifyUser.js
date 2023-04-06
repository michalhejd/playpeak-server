import mongoose from "mongoose";
import User from "../models/User.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
export async function verifyUserParams(id){
    //check if id is valid but its probably kinda useless
    if(!mongoose.Types.ObjectId.isValid(id)) throw new Error(responseErrors.server_error);
    //find user in db by id
    const user = await User.findOne({_id: id});
    //check if user exists
    if(!user) throw new Error(responseErrors.cookies_unauthorized);
    //check if user is verified otherwise return that he is not verified
    if(user.verified == false) throw new Error(responseErrors.not_verified);
    return user;
}