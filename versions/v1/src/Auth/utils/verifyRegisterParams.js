import mongoose from "mongoose";
import User from "../models/User.js";

export function verifyRegisterBody(email, nickname, name, password, birthdate, role, verified) {
    // verify email
    if (email.Length < 6 || email.Length >= 64) { return false; }
    if (typeof email !== 'string') { return false; }
    if (!regexMail(email)) { return false; }
    // verify nickname
    if (nickname.Length < 3 || nickname.Length >= 32) { return false; }
    if (typeof nickname !== 'string') { return false; }
    // verify name
    if (name.Length < 5 || name.Length >= 64) { return false; }
    if (typeof name !== 'string') { return false; }
    // verify password
    if (password.Length < 6 || password.Length >= 64) { return false; }
    if (typeof password !== 'string') { return false; }
    // verify birthdate
    if (typeof birthdate !== 'string') { return false; }
    if (typeof role !== 'number' && role != undefined) { return false; }
    if (typeof verified !== 'boolean' && verified != undefined) { return false; }

    return true;
}


export function regexMail(email) {
    const emailRegexp = /^[\w\._-]+@(skola\.)?ssps\.cz$/
    return emailRegexp.test(email);
}

