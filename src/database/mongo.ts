import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async () => {

  try {
    await connect(process.env.MONGO_URL as string);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.log("Erro: ", error);
  }

  // try {
  //   console.log("Conectando ao mongodb...");
  //   await connect(process.env.MONGO_URL_2 as string);
  //   console.log("MongoDB conectado com sucesso!");
    
  // } catch (error) {
  //   console.log("Erro conexao mongode: ", error);
  // }
}