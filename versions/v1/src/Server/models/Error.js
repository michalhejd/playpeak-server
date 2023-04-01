import mongoose from "mongoose";

// saves user error to database for later improvements of this app
// saves: user_id, error, dateOfError and endpoint where it happened
const errorSchema = new mongoose.Schema({
    error: {
        type: String,
        required: true
    },
    dateOfError: {
        type: String,
        required: true
    }
});

export default mongoose.model('Error', errorSchema, 'errors');