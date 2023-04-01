import express from "express"
import users from "./src/Auth/controllers/users.js"
import { handleErr } from './src/Responses/utils/errorHandler.js'
import checkToken from "./src/Token/utils/checkToken.js"

const router = express.Router()


// router.use(checkToken)
router.use("/users", users);





// must be last - handles all the errors
router.use(handleErr);

export default router;