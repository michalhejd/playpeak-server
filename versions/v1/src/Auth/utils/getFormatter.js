import mongoose from "mongoose"
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
export async function formatUser(user){
    if(!user) throw new Error(responseErrors.server_error)
    //ssps cajthaml discord
    //deletes password and __v from user
    const { password, __v, ...newUser } = user
    return newUser
}

export function formatUsers(users){
    if(!users) throw new Error(responseErrors.server_error)
    //creates new array for formatted users
    let newUsers = []

    users.map(user => {
        //ssps cajthaml discord
        //deletes password and __v from user
        const { password, __v, ...newUser } = user
        //pushes user to newUsers
        newUsers.push(newUser)
    })
    return newUsers
}
