import express from "express";
import User from "../models/User.js";
import { roles } from "../models/User.js";
import { responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
import { verifyRegisterBody } from "../utils/verifyRegisterParams.js";
import { signToken } from "../../Token/utils/signToken.js";
import { verifyUserParams } from "../utils/verifyUser.js";
import { formatUsers } from "../utils/getFormatter.js";
import { hashPassword } from "../utils/hashPassword.js";
import { Verify } from "../utils/verifyUserParams.js";
import { generateVerificationCode } from "../services/generateToken.js";
import Code from "../models/Code.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    // already logged in
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // checking if email and password are in correct format
    if (!body.email || !body.password) throw new Error(responseErrors.bad_format);
    const newUser = await User.findOne({ email: body.email })
    // checking if user exists
    if (!newUser) throw new Error(responseErrors.user_not_found);
    // checking if password is correct
    if (!await bcrypt.compare(body.password, newUser.password)) throw new Error(responseErrors.bad_credentials);
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
    if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
    if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);

    // hash user password
    const hashedPassword = await hashPassword(body.password);


    // create user instance
    const user = new User({
        email: body.email,
        nickname: body.nickname,
        name: body.name,
        password: hashedPassword,
        birthdate: body.birthdate
    });

    // generate verification code
    const code = generateVerificationCode();

    const verificationCode = new Code({
        code: code,
        sentToUser: user._id
    });

    // save code to db
    await verificationCode.save();
    
    
    // vytvoření tokenu s kódem pro ověření emailu a uložení kódu do db a uložení uživatele do db
    
    // save user to db
    await user.save();

    // odeslání emailu s kódem pro ověření emailu společně
    handleSuccess(res, responseSuccess.user_created);
});

router.post("/resendVerification", async (req, res) => {
    const body = req.body;

    // verify if email is in correct format
    if (!Verify.email(body.email)) throw new Error(responseErrors.bad_format);


});

router.delete("/logout", async (req, res) => {
    //check if user is logged in
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await User.findById(req.user);
    //check if user exists
    if (!user) throw new Error(responseErrors.cookies_unauthorized);
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
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //pass to function which will check if user exists and if user is verified
    const user = await verifyUserParams(req.user)
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);
    //get of query params
    const query = req.query;
    //maximum users per page
    const maxUsersPerPage = 2;
    //calc of max pages (from total User documents in db)
    const maxPages = Math.ceil(await User.countDocuments() / maxUsersPerPage);
    //check if page can be returned (if page number is not greater than maxPages and if page is not less than 1) otherwise return first page
    const page = query.page ? ((parseInt(query.page) > 0) ? ((parseInt(query.page) <= maxPages) ? parseInt(query.page) : 1) : 1) : 1;
    //check if sort is string
    if (typeof query.sort == "string") {
        //check which value of sort is requested otherwise not to sort
        if (query.sort == "newest") {
            query.sort = { _id: -1 };
        }
        if (query.sort == "oldest") {
            query.sort = { _id: 1 };
        }
    }
    //create users const and then call func which will format users(it will return users without their password and __v)
    const users = formatUsers(await User.find({}).lean().sort(query.sort || { _id: -1 }).skip((page - 1) * maxUsersPerPage).limit(maxUsersPerPage));
    //return param which will tell user on which page he is
    const currentPage = page;
    handleSuccess(res, responseSuccess.users_found, { users, maxPages, currentPage });
});

router.put("/@self", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);


    //func that verifies if user exists and if user is verified
    const user = await verifyUserParams(req.user)


    const body = req.body;


    //if body contains oldPassword and newPassword then it checks if oldPassword is correct and if newPassword is in correct format
    if (body.oldPassword && body.newPassword) {
        if (!await bcrypt.compare(body.oldPassword, user.password)) throw new Error(responseErrors.bad_credentials);
        if (!Verify.password(body.newPassword)) throw new Error(responseErrors.bad_format);
        //hashes new password
        user.password = await hashPassword(body.newPassword);
    }

    //check if body contains nickname and if new nickname is not matching with old nickname
    if (body.nickname && body.nickname !== user.nickname) {
        if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);
        if (!Verify.nickname(body.nickname)) throw new Error(responseErrors.bad_format);
        user.nickname = body.nickname;
    }


    //save user
    await user.save();
    handleSuccess(res, responseSuccess.user_updated);
});

router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await verifyUserParams(req.user)
    //check if user isn't player
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);

    const params = req.params;

    const updatedUser = await User.findOne({ _id: params.id });

    //check if user exists
    if (!updatedUser) throw new Error(responseErrors.user_not_found);

    const body = req.body;

    //check if body contains role and if role is in correct format
    if (body.role) {
        if (!Verify.role(body.role)) throw new Error(responseErrors.bad_format);
        if (body.role >= user.role) throw new Error(responseErrors.forbidden);

        updatedUser.role = body.role;
    }

    //check if body contains verified and if verified is in correct format
    if (body.verified) {
        if (user.role < roles.organizer) throw new Error(responseErrors.forbidden);
        if (!Verify.verified(body.verified)) throw new Error(responseErrors.bad_format);
    }

    //check if body contains name and if name is in correct format
    if (body.name) {
        if (!Verify.name(body.name)) throw new Error(responseErrors.bad_format);
        updatedUser.name = body.name;
    }

    //check if body contains nickname, if nickname doesnt exist and if nickname is in correct format
    if (body.nickname) {
        if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);
        if (!Verify.nickname(body.nickname)) throw new Error(responseErrors.bad_format);
        updatedUser.nickname = body.nickname;
    }

    //check if body contains email, if email doesnt exist and if email is in correct format
    if (body.email) {
        if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
        if (!Verify.email(body.email)) throw new Error(responseErrors.bad_format);
        updatedUser.email = body.email;
    }

    //check if body contains birthdate and if birthdate is in correct format
    if (body.birthdate) {
        if (!Verify.birthdate(body.birthdate)) throw new Error(responseErrors.bad_format);
        updatedUser.birthdate = body.birthdate;
    }

    //save user
    await updatedUser.save();
    handleSuccess(res, responseSuccess.user_updated);
});

export default router;
