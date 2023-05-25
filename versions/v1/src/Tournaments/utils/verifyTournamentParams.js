import mongoose from "mongoose";
import { VerifyTournament } from "./verifyTournament.js";

export function verifyTournamentBody(name, organizer, game, startDate, startRegistration, endRegistration, maxTeams, gameMode) {
    if(!VerifyTournament.name(name)) return false
    if(!VerifyTournament.id(organizer)) return false
    if(!VerifyTournament.id(game)) return false
    if(!VerifyTournament.date(startDate)) return false
    if(!VerifyTournament.date(startRegistration)) return false
    if(!VerifyTournament.date(endRegistration)) return false
    if(startRegistration >= endRegistration) return false
    if(startDate <= endRegistration) return false
    if(!VerifyTournament.maxTeams(maxTeams)) return false
    if(!VerifyTournament.gameMode(gameMode)) return false
}