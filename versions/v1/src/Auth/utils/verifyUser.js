import mongoose from "mongoose";
import User from "../models/User.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
export async function verifyUserParams(id){
    if(!mongoose.Types.ObjectId.isValid(id)) throw new Error(responseErrors.server_error);
    const user = await User.findOne({_id: id});
    if(!user) throw new Error(responseErrors.cookies_unauthorized);
    if(user.verified == false) throw new Error(responseErrors.not_verified);
    return user;
}