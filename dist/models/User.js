"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: String,
    email: { type: String, required: true },
    state: String,
    passwordHash: String,
    token: String,
});
const modelName = 'User';
const userModel = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName] :
    (0, mongoose_1.model)(modelName, schema);
exports.default = userModel;
