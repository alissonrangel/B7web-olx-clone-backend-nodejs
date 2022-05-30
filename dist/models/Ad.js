"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    idUser: String,
    state: String,
    category: String,
    images: [Object],
    dateCreated: Date,
    title: String,
    price: Number,
    priceNegotiable: Boolean,
    description: String,
    views: Number,
    status: String,
});
const modelName = 'Ad';
const adModel = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName] :
    (0, mongoose_1.model)(modelName, schema);
exports.default = adModel;
