import { Verify } from "./verifyUser.js"

export function verifyRegisterBody(email, nickname, name, password, birthdate) {
    // verify email
    if (!Verify.email(email)) { return false; }
    // verify nickname
    if (!Verify.nickname(nickname)) { return false; }
    // verify name
    if (!Verify.name(name)) { return false; }
    // verify password
    if (!Verify.password(password)) { return false; }
    // verify birthdate
    if (!Verify.birthdate(birthdate)) { return false; }
    return true;
}