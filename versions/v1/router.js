import express from "express"
import users from "./src/Auth/controllers/users.js"
import { handle } from './src/Responses/utils/errorHandler.js'

const router = express.Router()



router.use("/users", users);





// must be last - handles all the errors
router.use(handle);

export default router;