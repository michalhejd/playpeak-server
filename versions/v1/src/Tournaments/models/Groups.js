import mongoose from 'mongoose';
const { Schema } = mongoose;

const groupSchema = new Schema({
});

export default mongoose.model('Group', groupSchema, 'groups');