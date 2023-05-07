import express from 'express';
import { roles } from '../../Users/models/User.js';

const router = express.Router();

router.post('/tournament', async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await verifyUserParams(req.user)
    if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const body = req.body;

    // TODO
});