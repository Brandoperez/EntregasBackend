import { Schema, model } from "mongoose";
import cartModel from "./carts.models.js";



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
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: function () {
            return this.email === 'brandoperezinciarte@gmail.com' ? 'admin' : 'user';
          }
    },
    age: {
        type: Number,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
            ref: 'carts'
    },
    documents: [{
        type: String,
        ref: 'documents'
    }],
    last_connection: {
        type: Date,
        default: Date.now()
    },
});

userSchema.pre('save', async function (next){
    try{
        const newCart = await cartModel.create({})
        this.cart = newCart._id
    }catch{
        next(error)
    }
});

export const userModel = model('users', userSchema);