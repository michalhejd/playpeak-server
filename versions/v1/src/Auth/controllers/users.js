import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
import { verifyRegisterBody } from "../utils/verifyRegisterParams.js";
import { signToken } from "../../Token/utils/signToken.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    // already logged in
    if(req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // checking if email and password are in correct format
    if(!body.email || !body.password) throw new Error(responseErrors.bad_format);
    const newUser = await User.findOne({ email: body.email })
    // checking if user exists
    if(!newUser) throw new Error(responseErrors.user_not_found);
    // checking if password is correct
    if(await bcrypt.compare(body.password, newUser.password)) throw new Error(responseErrors.bad_format);
    // creating token and responsing
    handleSuccess(res, responseSuccess.login_success, { token: signToken({ _id: newUser._id }) });
});

router.post("/register", async (req, res) => {
    const body = req.body;
    // verify if all params are in correct format => if they are string, number, date, their length etc.
    // function returns true if all params are in correct format, otherwise returns false
    if (!verifyRegisterBody(body.email, body.nickname, body.name, body.password, body.birthdate)) throw new Error(responseErrors.bad_format);

    // verify if email and nickname are not already in use
    if (await User.findOne({email: body.email})) throw new Error(responseErrors.email_already_exists);
    if (await User.findOne({nickname: body.nickname})) throw new Error(responseErrors.nickname_already_exists);

    const user = new User({
        email: body.email,
        nickname: body.nickname,
        name: body.name,
        password: body.password,
        birthdate: body.birthdate
    });
    // todo:
    // zahashovat heslo
    // model pro token s kódem pro ověření emailu
    // vytvoření tokenu s kódem pro ověření emailu a uložení kódu do db a uložení uživatele do db
    // await token.save();
    await user.save();

    // odeslání emailu s kódem pro ověření emailu společně
    handleSuccess(res, responseSuccess.user_created);
});

//ověření kódu pomocí emailu

export default router;
