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
        case responseErrors.token_unauthorized:
            return res.status(401).json({ meta: { message: "Session expired", date: Date.now(), status: 401, error: err.message } });
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
        case responseErrors.invitations_disabled:
            return res.status(403).json({ meta: { message: "Invitations are disabled", date: Date.now(), status: 403, error: err.message } });
        case responseErrors.user_not_found:
            return res.status(404).json({ meta: { message: "User not found", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.code_not_found:
            return res.status(404).json({ meta: { message: "Code not found, you have to resend your verification code", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.game_not_found:
            return res.status(404).json({ meta: { message: "Game not found", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.team_not_found:
            return res.status(404).json({ meta: { message: "Team not found", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.player_not_found:
            return res.status(404).json({ meta: { message: "Player not found", date: Date.now(), status: 404, error: err.message } });
        case responseErrors.already_logged_in:
            return res.status(409).json({ meta: { message: "Already logged in", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_verified:
            return res.status(409).json({ meta: { message: "Already verified", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.verification_code_already_sent:
            return res.status(409).json({ meta: { message: "Verification code already sent", date: Date.now(), status: 409, error: err.message } });
        // saveErrorToDabase(err, timeOfError);
        case responseErrors.email_already_exists:
            return res.status(409).json({ meta: { message: "Email already exists", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.nickname_already_exists:
            return res.status(409).json({ meta: { message: "Nickname already exists", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.name_already_exists:
            return res.status(409).json({ meta: { message: "Name already exists", date: Date.now(), status: 409, error: err.message } });
        // saveErrorToDabase(err, timeOfError);
        case responseErrors.slug_taken:
            return res.status(409).json({ meta: { message: "Slug already taken", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_has_team:
            return res.status(409).json({ meta: { message: "You can`t have more than one team", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_in_team:
            return res.status(409).json({ meta: { message: "You are already in a team", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.cant_remove_yourself:
            return res.status(409).json({ meta: { message: "You can`t remove yourself", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.cant_leave_team_not_in:
            return res.status(409).json({ meta: { message: "You can`t leave a team you are not in", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.cant_leave_your_team:
            return res.status(409).json({ meta: { message: "You can`t leave your own team", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_invited:
            return res.status(409).json({ meta: { message: "You have already invited this player", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.already_requested:
            return res.status(409).json({ meta: { message: "You have already requested to join this team", date: Date.now(), status: 409, error: err.message } });
        case responseErrors.server_error:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 } });
        default:
            return res.status(500).json({ meta: { message: "Server error", date: Date.now(), status: 500 } });
    }
};
