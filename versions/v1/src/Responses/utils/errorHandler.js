import { responseErrors } from "./responseTemplate.js";
import { saveErrorToDabase } from "../../Server/services/saveError.js";

// handles all the errors
export function handleErr(err, req, res, next) {
    const timeOfError = Date.now();
    switch (err.message) {
        case  responseErrors.bad_format:
            return res.status(400).json({ meta: { message: "Bad format", date: Date.now(), status: 400 }} );
        case responseErrors.unauthorized:
            return res.status(401).json({ meta: { message: "Unauthorized", date: Date.now(), status: 401 }} );
        case responseErrors.user_not_found:
            return res.status(404).json({ meta: { message: "User not found", date: Date.now(), status: 404 }} );
        case responseErrors.user_already_exists:
            return res.status(409).json({ meta: { message: "User already exists", date: Date.now(), status: 409 }} );
            // saveErrorToDabase(err, timeOfError);
        case responseErrors.server_error:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 }} );
        case responseErrors.email_already_exists:
            return res.status(409).json({ meta: { message: "Email already exists", date: Date.now(), status: 409 }} );
        case responseErrors.nickname_already_exists:
            return res.status(409).json({ meta: { message: "Nickname already exists", date: Date.now(), status: 409 }} );
        default:
            return res.status(500).json({meta: {message: "Server error", date: Date.now(), status: 500}});
    }
};
