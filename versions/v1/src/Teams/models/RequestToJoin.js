import mongoose from 'mongoose';
const { Schema } = mongoose;

const requestToJoinSchema = new Schema({
    // to which team is the request sent
    team: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    },
    // who sent the request
    fromUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
});

export default mongoose.model('RequestToJoin', requestToJoinSchema, 'requestsToJoin');