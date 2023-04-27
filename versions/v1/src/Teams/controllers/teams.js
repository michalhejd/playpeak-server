import express from "express"
import Team from "../models/Team.js";
import { responseErrors, responseSuccess } from "../../Responses/utils/responseTemplate.js";
import { handleSuccess } from "../../Responses/utils/successHandler.js";
import { checkUser } from "../../Users/services/checkUser.js";
import User, { roles } from "../../Users/models/User.js";
import { VerifyTeam } from "../utils/verifyTeam.js";
import { formatUsers } from "../../Users/utils/getFormatter.js";
const router = express.Router()

//get teams
router.get("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    await checkUser(req.user)
    const teams = await Team.find()
    handleSuccess(res, responseSuccess.teams_found, teams)
})

//get team by id
router.get("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    await checkUser(req.user)
    const params = req.params
    if(!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if(!team) throw new Error(responseErrors.team_not_found)
    handleSuccess(res, responseSuccess.team_found, team)
})

//create team
router.post("/", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    const existingTeam = await Team.findOne({ capitan: user._id})
    if(existingTeam) throw new Error(responseErrors.already_has_team)
    const playerInTeam = await Team.findOne({ players: user._id})
    if(playerInTeam) throw new Error(responseErrors.already_in_team)
    const body = req.body
    if(await Team.findOne({ name: body.name })) throw new Error(responseErrors.name_already_exists)
    if(!VerifyTeam.name(body.name) || !VerifyTeam.invitations(body.invitations)) throw new Error(responseErrors.bad_format)
    const team = new Team({
        name: body.name,
        capitan: user._id,
        players: [user._id],
        invitations: body.invitations
    })
    await team.save()
    handleSuccess(res, responseSuccess.team_created, team)
})

//update team
router.put("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    const params = req.params
    if(!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if(!team) throw new Error(responseErrors.team_not_found)
    if(team.capitan != user._id) throw new Error(responseErrors.forbidden)
    const body = req.body
    //cant change password while tournament is ongoing
    if(body.name){
        if(await Team.findOne({ name: body.name })) throw new Error(responseErrors.name_already_exists)
        if(!VerifyTeam.name(body.name)) throw new Error(responseErrors.bad_format)
        team.name = body.name
    }
    if(body.invitations){
        if(!VerifyTeam.invitations(body.invitations)) throw new Error(responseErrors.bad_format)
        team.invitations = body.invitations
    }
    await team.save()
    handleSuccess(res, responseSuccess.team_updated, team)
})

//delete team
router.delete("/:id", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    const user = await checkUser(req.user)
    const params = req.params
    if(!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if(!team) throw new Error(responseErrors.team_not_found)
    //can`t delete team if team is joined in tournament
    if(team.capitan != user._id) throw new Error(responseErrors.forbidden)
    await Team.deleteOne({_id: params.id})
    handleSuccess(res, responseSuccess.team_deleted)
})

//get team members
router.get("/:id/members", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    const params = req.params
    if(!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if(!team) throw new Error(responseErrors.team_not_found)
    const members = await User.find({ _id: { $in: team.players }}).lean()
    handleSuccess(res, responseSuccess.team_players_found, formatUsers(members))
})

//remove member from team
router.delete("/:id/members/:memberId", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    //cant remove member if tournament is ongoing
    const params = req.params
    if(!VerifyTeam.id(params.id) || !VerifyTeam.id(params.memberId)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if(!team) throw new Error(responseErrors.team_not_found)
    if(team.capitan != user._id) throw new Error(responseErrors.forbidden)
    if(params.memberId == capitan) throw new Error(responseErrors.cant_remove_yourself)
    if(!team.players.includes(params.memberId)) throw new Error(responseErrors.player_not_found)
    team.players = team.players.filter(player => player != params.memberId)
    await team.save()
    handleSuccess(res, responseSuccess.team_player_removed)
})

router.delete("/:id/leave", async (req, res) => {
    if (!req.user) throw new Error(responseErrors.unauthorized);
    //check if user exists and if user is verified
    const user = await checkUser(req.user)
    //cant leave team if tournament is ongoing
    const params = req.params
    if(!VerifyTeam.id(params.id)) throw new Error(responseErrors.bad_format)
    const team = await Team.findById(params.id)
    if(!team) throw new Error(responseErrors.team_not_found)
    if(team.capitan == user._id) throw new Error(responseErrors.cant_leave_your_team)
    if(!team.players.includes(user._id)) throw new Error(responseErrors.cant_leave_team_not_in)
    team.players = team.players.filter(player => player != user._id)
    await team.save()
    handleSuccess(res, responseSuccess.team_left)
})

export default router