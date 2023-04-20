import {vokativ, isWoman} from "vokativ";
import nodemailer from "nodemailer";
import {config} from "dotenv"
import { verificationTemplate } from "../models/Email.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
config()

export async function sendEmail(user, code, url) {
    const name = user.name
    //split name and surname
    const sName = name.split(" ")[0]

    //get vokativ of name and surname
    const voName = vokativ(sName, isWoman(sName))

    //final name with vokativ and uppercase first letter
    const finalName = voName.charAt(0).toUpperCase() + voName.slice(1)
    try {
    //transporter settings
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log("Sending email to " + user.email)
    //mail options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verifikace emailu',
        html: verificationTemplate(finalName, code, url)
    };
    //send email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw new Error(responseErrors.server_error)
        }
    });
    } catch (err) {
        console.log(err)
        throw new Error(responseErrors.server_error)
    }
    return
}