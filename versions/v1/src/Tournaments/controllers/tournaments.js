import express from 'express';
import { roles } from '../../Users/models/User.js';
import { checkUser } from '../../Users/services/checkUser.js';
import { responseErrors, responseSuccess } from '../../Responses/utils/responseTemplate.js';
import { handleSuccess } from '../../Responses/utils/successHandler.js';
import { verifyTournamentBody } from '../utils/verifyTournamentParams.js';
import Tournament from '../models/Tournament.js';
import Game from '../../Games/models/Game.js';
import { VerifyTournament } from '../utils/verifyTournament.js';

const router = express.Router();

// get all tournaments
router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    await checkUser(req.user);
    const tournaments = await Tournament.find();
    handleSuccess(res, responseSuccess.tournaments_found, tournaments);
});

// get tournament by id
router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    await checkUser(req.user);
    const params = req.params;
    if (!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format);
    const tournament = await Tournament.findById(params.id);
    if (!tournament) throw new Error(responseErrors.tournament_not_found);
    handleSuccess(res, responseSuccess.tournament_found, tournament);
});

// create tournament
router.post('/', async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    // pass to function which will check if user exists and if user is verified
    const user = await checkUser(req.user)
    if (user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const body = req.body;
    if (!verifyTournamentBody(body.name, body.organizer, body.game, body.startDate, body.startRegistration, body.endRegistration, body.maxTeams, body.gameMode)) throw new Error(responseErrors.bad_format);

    if (!await Game.findById(body.game)) throw new Error(responseErrors.game_not_found);

    if (await Tournament.findOne({ name: body.name })) throw new Error(responseErrors.name_already_exists);
    if (await Tournament.findOne({ organizer: body.organizer })) throw new Error(responseErrors.cant_have_more_than_one_tournament);

    const tournament = new Tournament({
        name: body.name,
        organizer: body.organizer,
        game: body.game,
        startDate: body.startDate,
        startRegistration: body.startRegistration,
        endRegistration: body.endRegistration,
        maxTeams: body.maxTeams,
        gameMode: body.gameMode,
    });
    await tournament.save();

    handleSuccess(res, responseSuccess.tournament_created);
});

// update tournament
router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //verify user params
    const user = await checkUser(req.user);
    if(user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);
    const params = req.params;
    if (!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format);
    const tournament = await Tournament.findById(params.id);
    const body = req.body;

    if (body.name) {
        if(!VerifyTournament.name(body.name)) throw new Error(responseErrors.bad_format);
        tournament.name = body.name;
    }
    if (body.game){
        if(!VerifyTournament.id(body.game)) throw new Error(responseErrors.bad_format);
        const game = await Game.findById(body.game);
        if(!game) throw new Error(responseErrors.game_not_found);
        tournament.game = body.game;
    }
    if (body.startDate){
        if(!VerifyTournament.date(body.startDate)) throw new Error(responseErrors.bad_format);
        if(body.startDate <= tournament.endRegistration || body.startDate <= body.endRegistration) throw new Error(responseErrors.bad_format);
        tournament.startDate = body.startDate;
    }
    if (body.startRegistration){
        if(!VerifyTournament.date(body.startRegistration)) throw new Error(responseErrors.bad_format);
        if(body.startRegistration >= tournament.endRegistration || body.startRegistration >= body.endRegistration) throw new Error(responseErrors.bad_format);
        tournament.startRegistration = body.startRegistration;
    }
    if (body.endRegistration){
        if(!VerifyTournament.date(body.endRegistration)) throw new Error(responseErrors.bad_format);
        if(body.endRegistration <= tournament.startRegistration || body.endRegistration <= body.startRegistration) throw new Error(responseErrors.bad_format);
        tournament.endRegistration = body.endRegistration;
    }
    if (body.maxTeams){
        if(!VerifyTournament.maxTeams(body.maxTeams)) throw new Error(responseErrors.bad_format);
        tournament.maxTeams = body.maxTeams;
    }
    if (body.gameMode){
        if(!VerifyTournament.gameMode(body.gameMode)) throw new Error(responseErrors.bad_format);
        tournament.gameMode = body.gameMode;
    }
    await tournament.save();
    handleSuccess(res, responseSuccess.tournament_updated);
    
});

// delete tournament
router.delete("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user);

    if(user.role < roles.superAdmin) throw new Error(responseErrors.forbidden);

    const params = req.params;
    if (!VerifyTournament.id(params.id)) throw new Error(responseErrors.bad_format);
    const tournament = await Tournament.findById(params.id);
    if (!tournament) throw new Error(responseErrors.tournament_not_found);
    await Tournament.findByIdAndDelete(params.id);
    handleSuccess(res, responseSuccess.tournament_deleted);
})

export default router;
