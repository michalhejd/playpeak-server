import mongoose from "mongoose";
const { Schema } = mongoose;

const matchSchema = new Schema({
    matchDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    team1: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    team2: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    scoreTeam1: {
        type: Number,
        required: true,
        default: 0
    },
    scoreTeam2: {
        type: Number,
        required: true,
        default: 0
    }
});

export default mongoose.model('Match', matchSchema, 'matches');