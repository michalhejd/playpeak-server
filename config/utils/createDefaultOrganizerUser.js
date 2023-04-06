import User from '../../versions/v1/src/Auth/models/User.js';
import { roles } from '../../versions/v1/src/Auth/models/User.js';
import {hashPassword} from '../../versions/v1/src/Auth/utils/hashPassword.js';

export async function defaultOrganizer() {
    if (!process.env.ADMIN_EMAIL) {
        console.log("ADMIN_EMAIL is not set in .env file")
        process.exit(0)
    }
    const email = process.env.ADMIN_EMAIL
    const checkUser = await User.findOne({ email: email })
    if (checkUser) return
    //create random password for organizer
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(password)
    try {
        const user = new User({
            email: email,
            password: hashedPassword,
            nickname: "admin",
            name: "admin",
            birthdate: new Date(),
            role: roles.organizer,
            verified: true
        })
        await user.save()
        console.log("Default organizer created with \nEmail: " + process.env.ADMIN_EMAIL + "\nPassword: " + password)
    } catch (err) {
        console.log(err)
        process.exit(0)
    }
}
