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
const Category_1 = __importDefault(require("../models/Category"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    getCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cats = yield Category_1.default.find();
        let categories = [];
        for (const i in cats) {
            categories.push({
                _id: cats[i]._id,
                name: cats[i].name,
                slug: cats[i].slug,
                img: `${process.env.BASE}/static/assets/images/${cats[i].slug}.png`
            });
        }
        console.log("Cats: ", categories);
        res.json({ categories });
    }),
    addAction: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    getList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    getItem: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    editAction: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    })
};
