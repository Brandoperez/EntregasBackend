import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'user'],
        default: function () {
            return this.email === 'brandoperezinciarte@gmail.com' ? 'admin' : 'user';
          }
    },
    age: {
        type: Number,
        required: true
    }
})

export const userModel = model('users', userSchema);