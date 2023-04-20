import { responseErrors } from "./responseTemplate.js";
import { saveErrorToDabase } from "../../Server/services/saveError.js";

// handles all the errors
export function handleErr(err, req, res, next) {
    const timeOfError = Date.now();
    switch (err.message) {
        case responseErrors.bad_format:
            return res.status(400).json({ meta: { message: "Špatný formát", date: Date.now(), status: 400, error: err.message } });
        case responseErrors.unauthorized:
            return res.status(401).json({ meta: { message: "Neautorizovaný", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.token_unauthorized:
            return res.status(401).json({ meta: { message: "Session expired", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.bad_credentials:
            return res.status(401).json({ meta: { message: "Špatné údaje", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.bad_code:
            return res.status(401).json({ meta: { message: "Špatný kód", date: Date.now(), status: 401, error: err.message } });
        case responseErrors.forbidden:
            return res.status(403).json({ meta: { message: "Forbidden", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.not_verified:
            return res.status(403).json({ meta: { message: "Neverifikován", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.change_password:
            return res.status(403).json({ meta: { message: "Je potřeba, aby sis změnil heslo", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.user_not_found:
            return res.status(404).json({ meta: { message: "Uživatel nenalezen", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.code_not_found:
            return res.status(404).json({ meta: { message: "Kód nebyl nalezen, je potřeba aby sis ho nechal zaslat znovu", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.already_logged_in:
            return res.status(409).json({ meta: { message: "Already logged in", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_verified:
            return res.status(409).json({ meta: { message: "Already verified", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.verification_code_already_sent:
            return res.status(409).json({ meta: { message: "Verifikační kód byl už odeslán", date: Date.now(), status: 409, error: err.message } });
        // saveErrorToDabase(err, timeOfError);
        case responseErrors.email_already_exists:
            return res.status(409).json({ meta: { message: "Email už existuje", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.nickname_already_exists:
            return res.status(409).json({ meta: { message: "Přezdívka už existuje", date: Date.now(), status: 409, error: err.message } });
        // saveErrorToDabase(err, timeOfError);
        case responseErrors.server_error:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 } });
        default:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 } });
    }
};
