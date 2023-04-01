import express from "express";
import jwt from "jsonwebtoken";
import { responseErrors } from "../../Responses/utils/responseTemplate.js";

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    if (req.cookies.token) {
      jwt.verify(req.cookies.token, process.env.SECRET, (err, decoded) => {
        if (err) {
          throw next(new Error(responseErrors.unauthorized));
        }
        console.log(decoded)
        req.user = decoded;
        next();
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;