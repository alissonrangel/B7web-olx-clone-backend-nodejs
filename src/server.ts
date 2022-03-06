import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoConnect } from './database/mongo';
import fileupload from 'express-fileupload';
import routes from './routes';

dotenv.config();

mongoConnect();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(fileupload());

//server.use('/static', express.static(__dirname + '/public'));
server.use('/static', express.static('public'));
console.log('dirname: ', __dirname);

server.use('/', routes);


server.listen(process.env.PORT, ()=>{
  console.log(`Rodando no endereço - ${process.env.BASE}`);
});