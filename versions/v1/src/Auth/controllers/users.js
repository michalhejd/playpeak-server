import express from "express";
import bcrypt from "bcrypt";
import { responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
import { verifyRegisterBody } from "../utils/verifyRegisterParams.js";
import { signToken } from "../../Token/utils/signToken.js";
import { roles } from "../models/User.js";
import User from "../models/User.js";
import { verifyUserParams } from "../utils/verifyUser.js";
import { formatUsers } from "../utils/getFormatter.js";

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
    if(!await bcrypt.compare(body.password, newUser.password)) throw new Error(responseErrors.bad_credentials);
    //checking if user is verified
    verifyUserParams(newUser._id)
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

router.delete("/logout", async (req, res) => {
    //check if user is logged in
    if(!req.user) throw new Error(responseErrors.unauthorized);
    const user = await User.findById(req.user);
    //check if user exists
    if(!user) throw new Error(responseErrors.cookies_unauthorized);
    //sending response
    handleSuccess(res, responseSuccess.logout_success);
});


/*router.post("/", async (req, res) => {
    if(!req.user) throw new Error(responseErrors.unauthorized);
    const user = await verifyUserParams(req.user)
    if(user.role < roles.admin) throw new Error(responseErrors.forbidden);

    const body = req.body;
    if(!verifyRegisterBody(body.email, body.nickname, body.name, body.password, body.birthdate)) throw new Error(responseErrors.bad_format);
    if(body.role && typeof body.role !== "number") throw new Error(responseErrors.bad_format);
    if(body.role >= user.role) throw new Error(responseErrors.forbidden);

    try{
    const newUser = new User({
        email: body.email,
        nickname: body.nickname,
        name: body.name,
        birthdate: body.birthdate,
        password: null,
        role: body.role || roles.player
    });
    await newUser.save();
    } catch (e) {
        console.log(e)
        throw new Error(responseErrors.server_error);
    }

    handleSuccess(res, responseSuccess.user_created);
})*/

router.get("/", async (req, res) => {
    if(!req.user) throw new Error(responseErrors.unauthorized);
    //pass to function which will check if user exists and if user is verified
    const user = await verifyUserParams(req.user)
    if(user.role < roles.admin) throw new Error(responseErrors.forbidden);
    //get of query params
    const query = req.query;
    //maximum users per page
    const maxUsersPerPage = 2;
    //calc of max pages (from total User documents in db)
    const maxPages = Math.ceil(await User.countDocuments() / maxUsersPerPage);
    //check if page can be returned (if page number is not greater than maxPages and if page is not less than 1) otherwise return first page
    const page = query.page ? ((parseInt(query.page) > 0) ? ((parseInt(query.page) <= maxPages) ? parseInt(query.page) : 1) : 1) : 1;
    //check if sort is string
    if(typeof query.sort == "string"){
        //check which value of sort is requested otherwise not to sort
        if(query.sort == "newest"){
            query.sort = { _id: -1 };
        }
        if(query.sort == "oldest"){
            query.sort = { _id: 1 };
        }
    }
    //create users const and then call func which will format users(it will return users without their password and __v)
    const users = formatUsers(await User.find({}).lean().sort(query.sort || { _id: -1}).skip((page - 1) * maxUsersPerPage).limit(maxUsersPerPage));
    //return param which will tell user on which page he is
    const currentPage = page;
    handleSuccess(res, responseSuccess.users_found, { users,  maxPages, currentPage });
});

export default router;