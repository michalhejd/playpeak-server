import { responses } from "./responseTemplate.js";

export const response = (res, response, data) => {
    switch (response)
    {
        case responses.user_created:
            res.status(201).json({meta: {message: "User successfully created", status: 201}, data: data});
            break;
        case responses.login_success:
            res.status(200).json({meta: {message: "Login successful", status: 200}, data: data});
            break;
        default:
            res.status(500).json({meta: {message: "Internal server error", status: 500}, data: data});
            break;
    }
}