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
const Ad_1 = __importDefault(require("../models/Ad"));
const Category_1 = __importDefault(require("../models/Category"));
const State_1 = __importDefault(require("../models/State"));
const User_1 = __importDefault(require("../models/User"));
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    getStates: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let states = yield State_1.default.find({});
        res.json({ states });
    }),
    info: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let token = req.query.token;
        let user = yield User_1.default.findOne({ token });
        if (user) {
            const state = yield State_1.default.findById(user.state);
            const ads = yield Ad_1.default.find({ idUser: user._id.toString() });
            let adList = [];
            for (const item of ads) {
                const category = yield Category_1.default.findById(item.category);
                if (category) {
                    // adList.push({
                    //   id: item._id,
                    //   status: item.status,
                    //   images: item.images,
                    //   dateCreated: item.dateCreated,
                    //   title: item.title,          
                    //   price: item.price,
                    //   priceNegotiable: item.priceNegotiable,
                    //   description: item.description,
                    //   views: item.views,
                    //   category: category.slug
                    // })          
                    adList.push(Object.assign(Object.assign({}, item), { category: category.slug }));
                }
            }
            if (state && ads) {
                res.json({
                    name: user.name,
                    email: user.email,
                    state: state.name,
                    ads: adList,
                });
                return;
            }
            else {
                res.json({ error: "no state/ no ads" });
            }
        }
        else {
            res.json({ error: "no user" });
            return;
        }
    }),
    editAction: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.json({ error: errors.mapped() });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req);
        let token = data.token;
        let updates = { token };
        if (data.name) {
            updates.name = data.name;
        }
        if (data.email) {
            const emailCheck = yield User_1.default.findOne({ email: data.email });
            if (emailCheck) {
                res.json({ error: 'E-mail já existente' });
                return;
            }
            else {
                updates.email = data.email;
            }
        }
        if (data.state) {
            if (mongoose_1.default.Types.ObjectId.isValid(data.state)) {
                const stateCheck = yield State_1.default.findById(data.state);
                console.log("State:, ", stateCheck);
                if (!stateCheck) {
                    res.json({ error: 'Estado não existente' });
                    return;
                }
                else {
                    updates.state = data.state;
                }
            }
            else {
                res.json({
                    error: { state: { msg: "Código de estado inválido!" } }
                });
                return;
            }
        }
        if (data.password) {
            updates.passwordHash = yield bcrypt_1.default.hash(data.password, 11);
        }
        let result = yield User_1.default.findOneAndUpdate({ token }, { $set: updates });
        res.json({ result });
    })
};
