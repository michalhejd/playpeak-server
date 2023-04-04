import mongoose from "mongoose"
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
export async function formatUser(user){
    if(!user) throw new Error(responseErrors.server_error)
    delete user.password
    return user
}

export function formatUsers(users){
    if(!users) throw new Error(responseErrors.server_error)
    for(let i = 0; i < users.length; i++){
        delete users[i].password
        delete users[i].__v
    }
    return users
}
