import { responseSuccess } from "./responseTemplate.js";

export function handleSuccess(res, response, data) {
    switch (response)
    {
        case responseSuccess.success:
            res.status(200).json({meta: {message: "Success", status: 200}, data: data});
            return;
        case responseSuccess.users_found:
            res.status(200).json({meta: {message: "Users found", status: 200}, data: data});
            return;
        case responseSuccess.login_success:
            res.cookie("token", data.token, {httpOnly: true}).status(200).json({meta: {message: "Login successful", status: 200}});
            return;
        case responseSuccess.logout_success:
            res.clearCookie("token").status(200).json({meta: {message: "Logout successful", status: 200}});
            return;
        case responseSuccess.user_created:
            res.status(201).json({meta: {message: "User successfully created", status: 201}, data: data});
            return;
        default:
            res.status(500).json({meta: {message: "Internal server error", status: 500}});
            return;
    }
}