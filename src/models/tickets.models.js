import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    }
});

    ticketSchema.set('timestamps', true);
    const ticketModel = model('tickets', ticketSchema);
    export default ticketModel