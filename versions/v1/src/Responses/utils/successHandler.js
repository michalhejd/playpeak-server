import { responseSuccess } from "./responseTemplate.js";

export function handleSuccess(res, response, data) {
    switch (response) {
        case responseSuccess.success:
            res.status(200).json({ meta: { message: "Success", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.users_found:
            res.status(200).json({ meta: { message: "Users found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.user_found:
            res.status(200).json({ meta: { message: "User found", date: Date.now(), status: 200 }, data: data });
            return;
        case responseSuccess.user_updated:
            res.status(200).json({ meta: { message: "User updated", date: Date.now(), date: Date.now(), status: 200 } });
            return;
        case responseSuccess.login_success:
            res.cookie("token", data.token, { httpOnly: true }).status(200).json({ meta: { message: "Login successful", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.logout_success:
            res.clearCookie("token").status(200).json({ meta: { message: "Logout successful", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.user_verified:
            res.status(200).json({ meta: { message: "User verified", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.verification_email_sent:
            res.status(200).json({ meta: { message: "Verification email sent", date: Date.now(), status: 200 } });
            return;
        case responseSuccess.user_created:
            res.status(201).json({ meta: { message: "User successfully created", date: Date.now(), status: 201 }, data: data });
            return;
        default:
            res.status(500).json({ meta: { message: "Internal server error", date: Date.now(), status: 500 } });
            return;
    }
}