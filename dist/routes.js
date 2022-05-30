"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdsController_1 = __importDefault(require("./controllers/AdsController"));
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const Auth_1 = __importDefault(require("./middlewares/Auth"));
const AuthValidator_1 = __importDefault(require("./validators/AuthValidator"));
const UserValidator_1 = __importDefault(require("./validators/UserValidator"));
const router = (0, express_1.Router)();
router.get('/ping', (req, res) => {
    res.json({ pong: true });
});
router.get('/states', UserController_1.default.getStates);
router.post('/user/signin', AuthValidator_1.default.signin, AuthController_1.default.signin);
router.post('/user/signup', AuthValidator_1.default.signup, AuthController_1.default.signup);
router.get('/user/me', Auth_1.default.private, UserController_1.default.info);
router.put('/user/me', UserValidator_1.default.editAction, Auth_1.default.private, UserController_1.default.editAction);
router.get('/categories', AdsController_1.default.getCategories);
router.post('/ad/add', Auth_1.default.private, AdsController_1.default.addAction);
router.get('/ad/list', AdsController_1.default.getList);
router.get('/ad/item', AdsController_1.default.getItem);
router.post('/ad/:id', Auth_1.default.private, AdsController_1.default.editAction);
exports.default = router;
