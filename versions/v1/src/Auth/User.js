import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 64
    },
    nickname: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 32
    },
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 64
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 64
    },
    birthdate: {
        type: Date,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    verfied: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default mongoose.model('User', userSchema, 'users');