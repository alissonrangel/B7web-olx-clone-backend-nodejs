"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("./database/mongo");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
(0, mongo_1.mongoConnect)();
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, express_fileupload_1.default)());
server.use('/static', express_1.default.static(__dirname + '/public'));
console.log('dirname: ', __dirname);
server.use('/', routes_1.default);
server.listen(process.env.PORT, () => {
    console.log(`Rodando no endereço - ${process.env.BASE}`);
});
