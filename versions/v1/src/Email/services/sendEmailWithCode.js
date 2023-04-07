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
    const sSurname = name.split(" ")[1]

    //get vokativ of name and surname
    const voName = vokativ(sName, isWoman(sName))
    const voSurname = vokativ(sSurname, isWoman(sSurname))

    //final name with vokativ and uppercase first letter
    const finalName = voName.charAt(0).toUpperCase() + voName.slice(1) + " " + voSurname.charAt(0).toUpperCase() + voSurname.slice(1)
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
        from: "info@h3jduk.cz",
        to: user.email,
        subject: 'Verifikace emailu',
        html: verificationTemplate(finalName, code, url)
    };
    //send email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    } catch (err) {
        console.log(err)
        throw new Error(responseErrors.server_error)
    }
    return
}