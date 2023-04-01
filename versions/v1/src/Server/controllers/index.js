import express from "express"
import { response } from "../../Responses/utils/response.js"
import { responseSuccess } from "../../Responses/utils/responseTemplate.js"

const router = express.Router()

router.get("/", (req, res) => {
    response(res, responseSuccess("success"), { version: process.env.npm_package_version })
})