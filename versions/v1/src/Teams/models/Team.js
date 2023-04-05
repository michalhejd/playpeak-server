import mongoose from "mongoose";
const { Schema } = mongoose;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 32
    },
    shortName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 3
    },
    // array of players -> user ids
    players: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    ownner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matches: {
        type: [Schema.Types.ObjectId],
        ref: 'Match',
        required: false
    },
    invitations: {
        type: Boolean,
        required: true,
        default: true
    }
});

export default mongoose.model('Team', teamSchema, 'teams');