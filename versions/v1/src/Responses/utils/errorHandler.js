import { responseErrors } from "./responseTemplate.js";
import { saveErrorToDabase } from "../../Server/services/saveError.js";

// handles all the errors
export function handleErr(err, req, res, next) {
    const timeOfError = Date.now();
    switch (err.message) {
        case responseErrors.bad_format:
            return res.status(400).json({ meta: { message: "Bad format", date: Date.now(), status: 400, error: err.message } });
        case responseErrors.unauthorized:
            return res.status(401).json({ meta: { message: "Unauthorized", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.cookies_unauthorized:
            return res.clearCookie("token").status(401).json({ meta: { message: "Session expired", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.bad_credentials:
            return res.status(401).json({ meta: { message: "Bad credentials", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.bad_code:
            return res.status(401).json({ meta: { message: "Bad code", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.forbidden:
            return res.status(403).json({ meta: { message: "Forbidden", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.not_verified:
            return res.status(403).json({ meta: { message: "Not verified", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.change_password:
            return res.status(403).json({ meta: { message: "You need to change your password", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.user_not_found:
            return res.status(404).json({ meta: { message: "User not found", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.code_not_found:
            return res.status(404).json({ meta: { message: "Code not found, you have to resend your verification code", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.already_logged_in:
            return res.status(409).json({ meta: { message: "Already logged in", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_verified:
            return res.status(409).json({ meta: { message: "Already verified", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.verification_code_already_sent:
            return res.status(409).json({ meta: { message: "Verification code already sent", date: Date.now(), status: 409, error: err.message } });
        // saveErrorToDabase(err, timeOfError);
        case responseErrors.server_error:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 } });
        case responseErrors.email_already_exists:
            return res.status(409).json({ meta: { message: "Email already exists", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.nickname_already_exists:
            return res.status(409).json({ meta: { message: "Nickname already exists", date: Date.now(), status: 409, error: err.message } });
        // saveErrorToDabase(err, timeOfError);
        default:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 } });
    }
};
