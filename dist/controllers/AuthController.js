"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const State_1 = __importDefault(require("../models/State"));
const User_1 = __importDefault(require("../models/User"));
exports.default = {
    signin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.json({ error: errors.mapped() });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req);
        const user = yield User_1.default.findOne({ email: data.email });
        if (!user) {
            res.json({
                error: { email: { msg: "E-mail e/ou senha errados!" } }
            });
            return;
        }
        const match = yield bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!match) {
            res.json({
                error: { email: { msg: "E-mail e/ou senha errados!" } }
            });
            return;
        }
        const payload = (Date.now() + Math.random()).toString();
        const token = yield bcrypt_1.default.hash(payload, 11);
        user.token = token;
        yield user.save();
        res.json({ token, email: data.email });
    }),
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.json({ error: errors.mapped() });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req);
        const user = yield User_1.default.findOne({ email: data.email });
        if (user) {
            res.json({
                error: { email: { msg: "E-mail já existe!" } }
            });
            return;
        }
        if (mongoose_1.default.Types.ObjectId.isValid(data.state)) {
            const state = yield State_1.default.findById(data.state);
            if (!state) {
                res.json({
                    error: { state: { msg: "Estado não existe!" } }
                });
                return;
            }
        }
        else {
            res.json({
                error: { state: { msg: "Código de estado inválido!" } }
            });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(data.password, 11);
        const payload = (Date.now() + Math.random()).toString();
        const token = yield bcrypt_1.default.hash(payload, 11);
        const newUser = new User_1.default({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
            state: data.state,
        });
        yield newUser.save();
        res.json({ token });
    })
};
