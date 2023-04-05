import mongoose from 'mongoose';
const { Schema } = mongoose;

// what teams are in the bracket -> who is competing with who

const bracketSchema = new Schema({
});

export default mongoose.model('Bracket', bracketSchema, 'brackets');