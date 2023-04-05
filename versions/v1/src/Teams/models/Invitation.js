import mongoose from 'mongoose';
const { Schema } = mongoose;

const invitationSchema = new Schema({
    team: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    },
    // who sent the invitation
    fromUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // who received the invitation
    toUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

export default mongoose.model('Invitation', invitationSchema, 'invitations');