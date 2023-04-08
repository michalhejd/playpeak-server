import express from "express";
import User from "../models/User.js";
import { roles } from "../models/User.js";
import { responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";
import { verifyRegisterBody } from "../utils/verifyRegisterParams.js";
import { signToken } from "../../Token/utils/signToken.js";
import { verifyUserParams } from "../utils/verifyUser.js";
import { formatUsers, formatUser } from "../utils/getFormatter.js";
import { Password } from "../utils/Password.js";
import { Verify } from "../utils/verifyUserParams.js";
import { generateVerificationCode } from "../services/generateToken.js";
import Code from "../models/Code.js";
import { sendEmail } from "../../Email/services/sendEmailWithCode.js";
import { emailLimiter } from "../../RateLimit/services/ratelimit.js";

const router = express.Router();


/**
 * @swagger
 * /users:
 *  get:
 *      summary: Get all users
 *      tags: [Users]
 *      parameters:
 *          - name: page
 *            in: query
 *            description: Page number
 *            required: false
 *            schema:
 *              type: Number
 *          - name: sort
 *            in: query
 *            description: Sort by
 *            required: false
 *            schema:
 *              type: String
 *      responses:
 *          200:
 *              description: Users were returned.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Users found
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      users:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: String
 *                                                      example: 5f9f1b9b0b9b9b9b9b9b9b9b9
 *                                                  email:
 *                                                      type: String
 *                                                      example:
 *                                                  nickname:
 *                                                      type: String
 *                                                      example:
 *                                                  name:
 *                                                      type: String
 *                                                      example:
 *                                                  birthdate:
 *                                                      type: Date
 *                                                      example:
 *                                                  role:
 *                                                      type: Number
 *                                                      example:
 *                                                  verified:
 *                                                      type: Boolean
 *                                                      example:
 *                                      maxPages:
 *                                          type: Number
 *                                          example: 2
 *                                      currentPage:
 *                                          type: Number
 *                                          example: 1
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          500:
 *              description: Internal server error.
 * 
 */

router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //pass to function which will check if user exists and if user is verified
    const user = await verifyUserParams(req.user)
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);
    //get of query params
    const query = req.query;
    //maximum users per page
    const maxUsersPerPage = 2;
    // calc of max pages (from total User documents in db)
    const maxPages = Math.ceil(await User.countDocuments() / maxUsersPerPage);
    // check if page can be returned (if page number is not greater than maxPages and if page is not less than 1) otherwise return first page
    const page = query.page ? ((parseInt(query.page) > 0) ? ((parseInt(query.page) <= maxPages) ? parseInt(query.page) : 1) : 1) : 1;
    // check if sort is string
    if (typeof query.sort == "string") {
        //check which value of sort is requested otherwise not to sort
        if (query.sort == "newest") {
            query.sort = { _id: -1 };
        }
        if (query.sort == "oldest") {
            query.sort = { _id: 1 };
        }
    }
    // create users const and then call func which will format users(it will return users without their password and __v)
    const users = formatUsers(await User.find({}).lean().sort(query.sort || { _id: -1 }).skip((page - 1) * maxUsersPerPage).limit(maxUsersPerPage));
    // return param which will tell user on which page he is
    const currentPage = page;
    handleSuccess(res, responseSuccess.users_found, { users, maxPages, currentPage });
});

/**
 * @swagger
 * /users/@self:
 *  get:
 *      summary: Get self user data
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Found user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: User found
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: String
 *                                          example: 642ad0a05938a24b3c8a501e
 *                                      email:
 *                                          type: String
 *                                          example: novak.ja.2020@skola.ssps.cz
 *                                      nickname:
 *                                          type: String
 *                                          example: Janecek1
 *                                      name: 
 *                                          type: String
 *                                          example: Jan Novák
 *                                      birthdate:
 *                                          type: Date
 *                                          example: 2004-01-01T00:00:00.000Z
 *                                      role: 
 *                                          type: Number
 *                                          example: 0
 *                                      verified:
 *                                          type: Boolean
 *                                          example: true
 *                                      expiresAt:
 *                                          type: Date
 *                                          example: null
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Internal server error.
 */

router.get("/@self", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await verifyUserParams(req.user);
    console.log(formatUser(user));
    // return user without his password and __v
    handleSuccess(res, responseSuccess.user_found, formatUser(user));
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get user data by id
 *      tags: [Users]
 *      operationId: getUserById
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID of user to return
 *          required: true
 *          schema:
 *             type: string
 *      responses:
 *          200:
 *              description: Found user.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: User found
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          404:
 *              description: User not found.
 *          500:
 *              description: Internal server error.
 */ 
router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    console.log(req.user);
    const user = await verifyUserParams(req.user)
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);
    // get id from params
    const id = req.params.id;
    // check if id is in correct format
    if (!Verify.id(id)) throw new Error(responseErrors.bad_format);
    // check if user exists
    const userFound = await User.findById(id);
    if (!userFound) throw new Error(responseErrors.user_not_found);
    // return user without his password and __v
    handleSuccess(res, responseSuccess.user_found, formatUser(userFound));
});



/**
 * @swagger
 * /users/login:
 *  post:
 *      summary: Login a user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: String
 *                              example: novak.ja.2023@skola.ssps.cz
 *                          password:
 *                              type: String
 *                              example: Novacekjan123
 *      responses:
 *          200:
 *              description: Login successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Login successful
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 *                                          
 *          400:
 *             description: Bad request
 *          409:
 *             description: User already logged in
 *          500:
 *             description: Internal server error
 * 
 * 
 */

router.post("/login", async (req, res) => {
    // already logged in
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // checking if email and password are in correct format
    if (!body.email || !body.password) throw new Error(responseErrors.bad_format);
    const user = await User.findOne({ email: body.email })
    // checking if user exists
    if (!user) throw new Error(responseErrors.user_not_found);
    // checking if password is correct
    if (!await Password.verify(body.password, user.password)) throw new Error(responseErrors.bad_credentials);
    //checking if user is verified
    verifyUserParams(user._id)
    handleSuccess(res, responseSuccess.login_success, { token: signToken({ _id: user._id }) });
});

 /**
* @swagger
* /users/register:
*  post:
*      summary: Create a new user
*      tags: [Users]
*      requestBody:
*          required: true
*          content: 
*              application/json:
*                  schema:
*                      type: object
*                      properties: 
*                          email:
*                              type: String
*                              example: novak.ja.2023@skola.ssps.cz
*                          nickname:
*                              type: String
*                              example: Janecek1
*                          name:
*                              type: String
*                              example: Jan Novák
*                          password:
*                              type: String
*                              example: Novacekjan123
*                          birthdate:
*                              type: String
*                              example: 2021-02-01
*      responses:
*          200: 
*              description: User was created.
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                               meta:
*                                   type: object
*                                   properties:
*                                       message:
*                                           type: String
*                                           example: User successfully created
*                                       date:
*                                           type: Date
*                                           example: 1680895221293
*                                       status:
*                                           type: Number
*                                           example: 201
*          400:
*              description: Bad format.
*          409:
*              description: User already exists.
*          500:
*              description: Internal server error.
*/
router.post("/register", emailLimiter, async (req, res) => {
    if(req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // verify if all params are in correct format => if they are string, number, date, their length etc.
    // function returns true if all params are in correct format, otherwise returns false

    if (!verifyRegisterBody(body.email, body.nickname, body.name, body.password, body.birthdate)) throw new Error(responseErrors.bad_format);

    // verify if email and nickname are not already in use
    if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
    if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);

    // hash user password
    const hashedPassword = await Password.hash(body.password);


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

    // save user to db
    await user.save();

    // sending verification email with code and link to verification page
    sendEmail(user, code, process.env.EMAIL_VERIFICATION_URL + `/${verificationCode._id}`)

    // sending response
    handleSuccess(res, responseSuccess.user_created);
});

/**
* @swagger
* /users/resendVerification:
*  post:
*      summary: Resend verification email
*      tags: [Users]
*      requestBody:
*          required: true
*          content: 
*              application/json:
*                  schema:
*                      type: object
*                      properties:
*                          email:
*                              type: String
*                              example: novak.ja.2023@skola.ssps.cz
*      responses:
*          200: 
*              description: Email was sent.
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                               meta:
*                                   type: object
*                                   properties:
*                                       message:
*                                           type: String
*                                           example: Verification email sent
*                                       date:
*                                           type: Date
*                                           example: 1680895221293
*                                       status: 
*                                           type: Number
*                                           example: 200
*          400:
*              description: Bad format.
*          409:
*              description: User already exists.
*          500:
*              description: Internal server error.
*/
router.post("/resendVerification", emailLimiter,  async (req, res) => {
    if(req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    if(typeof body.email !== 'string') throw new Error(responseErrors.bad_format);

    const user = await User.findOne({ email: body.email });
    if(!user) throw new Error(responseErrors.user_not_found);
    if(user.verified) throw new Error(responseErrors.already_verified);

    const code = await Code.findOne({ sentToUser: user._id });
    if(code) throw new Error(responseErrors.verification_code_already_sent);

    const newCode = generateVerificationCode();

    const verificationCode = new Code({
        code: newCode,
        sentToUser: user._id
    });

    await verificationCode.save();

    sendEmail(user, newCode, process.env.EMAIL_VERIFICATION_URL + `/${verificationCode._id}`)
    handleSuccess(res, responseSuccess.verification_email_sent);
});

/**
 * @swagger
 * /users:
 *  post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          email:
 *                              type: String
 *                              example: novak.ja.2023@skola.ssps.cz
 *                          nickname:
 *                              type: String
 *                              example: Janecek1
 *                          name:
 *                              type: String
 *                              example: Jan Novák
 *                          password:
 *                              type: String
 *                              example: Novacekjan123
 *                          birthdate:
 *                              type: String
 *                              example: 2021-02-01
 *      responses:
 *          200:
 *              description: User was created.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: User successfully created
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status: 
 *                                          type: Number
 *                                          example: 201
 *          400:
 *              description: Bad format.
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          409:
 *              description: Already exists.
 *          500:
 *              description: Internal server error.
 *                      
 */

router.post("/", emailLimiter, async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // check if user exists and if his account is verified
    const user = await verifyUserParams(req.user)
    // check if user is at least admin
    if (user.role < roles.admin) throw new Error(responseErrors.forbidden);

    const body = req.body;

    // verify if all params are in correct format => if they are string, number, date, their length etc.
    if (!verifyRegisterBody(body.email, body.nickname, body.name, body.password, body.birthdate)) throw new Error(responseErrors.bad_format);

    // if body contains role param, check if user is superAdmin and verify if role is in correct format
    if (body.role) {
        if (!Verify.role(body.role)) throw new Error(responseErrors.bad_format);
        if (body.role >= user.role) throw new Error(responseErrors.forbidden);
    }
    // if body contains verified param, check if user is superAdmin and verify if verified is in correct format
    if (body.verified) {
        if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
        if (!Verify.verified(body.verified)) throw new Error(responseErrors.bad_format);
    }

    // verify if email and nickname are not already in use
    if (await User.findOne({ email: body.email })) throw new Error(responseErrors.email_already_exists);
    if (await User.findOne({ nickname: body.nickname })) throw new Error(responseErrors.nickname_already_exists);

    // hash user password
    const hashedPassword = await Password.hash(body.password);

    const newUser = new User({
        email: body.email,
        nickname: body.nickname,
        name: body.name,
        birthdate: body.birthdate,
        password: hashedPassword,
        role: body.role || roles.player,
        verified: body.verified || false
    });

    
    // save user to db
    await newUser.save();

    if (!newUser.verified) {
        const code = generateVerificationCode();

        const verificationCode = new Code({
            code: code,
            sentToUser: newUser._id
        });

        // save code to db
        await verificationCode.save();
        // send email with code if user is not verified
        sendEmail(newUser, code, process.env.EMAIL_VERIFICATION_URL + `/${verificationCode._id}`)
    }
    
    handleSuccess(res, responseSuccess.user_created);
});


/**
 * @swagger
 * /users/@self:
 *  put:
 *      summary: Update self user data
 *      tags: [Users]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nickname:
 *                              type: String
 *                              example: Janecek1
 *                          oldPassword:
 *                              type: String
 *                              example: JanecekNovak123
 *                          newPassword:
 *                              type: String
 *                              example: JanecekNovak1234
 *      responses:
 *          200:
 *              description: User updated.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: User updated
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          example: 200
 * 
 *          400:
 *              description: Bad request.
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Internal server error.
 */

router.put("/@self", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);

    //func that verifies if user exists and if user is verified
    const user = await verifyUserParams(req.user)

    const body = req.body;

    //if body contains oldPassword and newPassword then it checks if oldPassword is correct and if newPassword is in correct format
    if (body.oldPassword && body.newPassword) {
        if (!await Password.verify(body.oldPassword, user.password)) throw new Error(responseErrors.bad_credentials);
        if (!Verify.password(body.newPassword)) throw new Error(responseErrors.bad_format);
        //hashes new password
        user.password = await Password.hash(body.newPassword);
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

/**
 * @swagger
 * /users/{id}:
 *  put:
 *      summary: Update user data by id
 *      tags: [Users]
 *      operationId: updateUserById
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of user to update
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          description: User object that needs to be updated
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nickname:
 *                              type: String
 *                              example: Janecek1
 *                          name:
 *                              type: String
 *                              example: Jan Novák
 *                          birthdate:
 *                              type: Date
 *                              example: 1680895221293
 *                          role:
 *                              type: Number
 *                              example: 0
 *                          verified:
 *                              type: Boolean
 *                              example: true
 *                          email:
 *                              type: String
 *                              example: novak.ja.2020@skola.ssps.cz
 *      responses:
 *          200:
 *              description: User updated.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: User updated
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status: 
 *                                          type: Number
 *                                          example: 200
 *          401:
 *              description: Unauthorized.
 *          403:
 *              description: Forbidden.
 *          404:
 *              description: User not found.
 *          500:
 *              description: Internal server error.
 * 
 */ 
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
    if (updatedUser.role >= user.role) throw new Error(responseErrors.forbidden);

    const body = req.body;

    //check if body contains role and if role is in correct format
    if (body.role) {
        if (!Verify.role(body.role)) throw new Error(responseErrors.bad_format);
        if (body.role >= user.role) throw new Error(responseErrors.forbidden);

        updatedUser.role = body.role;
    }

    //check if body contains verified and if verified is in correct format
    if (body.verified) {
        if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
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

/**
 * @swagger
 * /users/verify:
 *  patch:
 *      summary: Verify user
 *      tags: [Users]
 *      operationId: verifyUser
 *      requestBody:
 *          description: User email and code
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: String
 *                              description: User email
 *                              example: novak.ja.2023@skola.ssps.cz
 *                          code:
 *                              type: String
 *                              description: Code sent to user
 *                              example: 123456
 *      responses:
 *          200:
 *              description: User verified
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          description: Message
 *                                          example: User verified
 *                                      date: 
 *                                          type: Date
 *                                          description: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          description: Status
 *                                          example: 200
 *          400:
 *              description: Bad request
 *          404:
 *              description: User not found
 *          409:
 *              description: User already verified
 *          500:
 *              description: Internal server error
 * 
 */ 

router.patch("/verify", emailLimiter, async (req, res) => {
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const body = req.body;
    // check if body contains email and if email is in correct format

    if (typeof body.email !== "string") throw new Error(responseErrors.bad_format);
    if (typeof body.code !== "string") throw new Error(responseErrors.bad_format);
    const user = await User.findOne({ email: body.email });
    if (!user) throw new Error(responseErrors.user_not_found);
    // check if user is verified
    if (user.verified) throw new Error(responseErrors.already_verified);

    const code = await Code.findOne({ sentToUser: user._id });
    if (!code) throw new Error(responseErrors.code_not_found);
    if (code.code !== body.code) throw new Error(responseErrors.bad_code);

    user.verified = true;
    user.expiresAt = null;

    // remove code from database
    try {
        await Code.deleteOne({_id: code._id});
    } catch (err) {
         throw new Error(responseErrors.code_not_found);
    }
    // save user with verified status
    await user.save();
    
    handleSuccess(res, responseSuccess.user_verified);
});

/**
 * @swagger
 * /users/verify/{id}:
 *  patch:
 *      summary: Verify user
 *      tags: [Users]
 *      operationId: verifyUser
 *      parameters:
 *          - name: id
 *            in: path
 *            description: User id
 *            required: true
 *            schema:
 *              type: string
 *              example: 60a6c5b0b0b0b0b0b0b0b0b0
 *      responses:
 *          200:
 *              description: User verified
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          description: Message
 *                                          example: User verified
 *                                      date:
 *                                          type: Date
 *                                          description: Date
 *                                          example: 1680895221293
 *                                      status:
 *                                          type: Number
 *                                          description: Status
 *                                          example: 200
 *          400:
 *              description: Bad format.
 *          404:
 *              description: User not found
 *          409:
 *              description: User already verified
 *          500:
 *              description: Internal server error
 */ 

router.patch("/verify/:id", emailLimiter, async (req, res) => {
    if (req.user) throw new Error(responseErrors.already_logged_in);
    const params = req.params;
    if(typeof params.id !== "string") throw new Error(responseErrors.bad_format);
    if(!Verify.id(params.id)) throw new Error(responseErrors.bad_format);
    const code = await Code.findOne({ _id: params.id });
    if (!code) throw new Error(responseErrors.code_not_found);

    const user = await User.findOne({ _id: params.id });
    if (!user) throw new Error(responseErrors.user_not_found);
    // check if user is verified
    if (user.verified) throw new Error(responseErrors.already_verified);

    //delete code
    await Code.deleteOne({ _id: params.id });

    user.verified = true;
    user.expiresAt = null;

    await user.save();

    handleSuccess(res, responseSuccess.user_verified);
});

/**
 * @swagger
 * /users/logout:
 *  delete:
 *      summary: Create a new user
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Successfully logout.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              meta:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: String
 *                                          example: Logout successful
 *                                      date:
 *                                          type: Date
 *                                          example: 1680895221293
 *                                      status: 
 *                                          type: Number
 *                                          example: 200
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Internal server error.
 *                      
 */
router.delete("/logout", async (req, res) => {
    //check if user is logged in
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await User.findById(req.user);
    //check if user exists
    if (!user) throw new Error(responseErrors.cookies_unauthorized);
    //sending response
    handleSuccess(res, responseSuccess.logout_success);
});

export default router;
