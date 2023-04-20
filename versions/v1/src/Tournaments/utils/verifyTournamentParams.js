import mongoose from "mongoose";

export class VerifyTournament {
    static name(name) {
        if (typeof name !== 'string') return false;
        if (name.length < 3 || name.length > 64) return false;
        return true;
    }
    // no need to verify user, user is checked 
    static game(game) {
        if (!mongoose.Types.ObjectId.isValid(game)) return false;
    }

    static startDate(startDate) {
        if (typeof startDate !== 'string') return false;
        const date = new Date(startDate);
        
        if (date == 'Invalid Date') return false;
        // fix this using moment.js
        // if (startDate <= new Date() && startDate.) return false;
        return true;
    }

    // finish this

}