import mongoose from "mongoose"
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
export function formatUser(user){
    if(!user) throw new Error(responseErrors.server_error);

    const newUser = {};

    for (let [key, value] of Object.entries(user._doc)) {
        if(key != "password" && key != "__v" && key != "expiresAt"){
            newUser[key] = value;
        }
    }

    return newUser;
}

export function formatUsers(users){
    if(!users) throw new Error(responseErrors.server_error)
    //creates new array for formatted users
    let newUsers = []

    users.map(user => {
        //ssps cajthaml discord
        //deletes password and __v from user
        const { password, __v, expiresAt, ...newUser } = user
        //pushes user to newUsers
        newUsers.push(newUser)
    })
    return newUsers
}
