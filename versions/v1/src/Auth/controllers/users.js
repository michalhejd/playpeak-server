import express from 'express';
import { responses } from '../../Responses/utils/responseTemplate.js';
import { response } from '../../Responses/utils/response.js';
import { responseErrors } from '../../Responses/utils/responseTemplate.js';
import { verifyMail } from '../../Email/utils/verifyMail.js';

const router = express.Router();

router.get("/login", (req, res) => {
    res.send("ahoj");
});

router.post("/register", async (req, res) => {
    const body = req.body;
    if (!verifyMail(body.email)) { throw new Error("bad_format"); }
    response(res, responses.user_created);
});

export default router;