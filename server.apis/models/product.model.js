import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    batch:{
        type: String,
        required: true,
        trim: true
    },
    expiry:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        trim: true
    },
    stock:{
        type: Number,
        required: true,
        trim: true
    },
});

export const Product = model('products', productSchema);
