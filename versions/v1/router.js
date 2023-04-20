import express from "express"
import users from "./src/Users/controllers/users.js"
import games from "./src/Games/controllers/games.js"
import { handleErr } from './src/Responses/utils/errorHandler.js'
import server from "./src/Server/controllers/index.js"
import checkToken from "./src/Token/utils/checkToken.js"

const router = express.Router()

router.use(checkToken)


router.use("/", server)
router.use("/users", users);
router.use("/games", games);





// must be last - handles all the errors
router.use(handleErr);

export default router;