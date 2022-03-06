import { Schema, Model, model, connection } from 'mongoose';

type UserType = {
  name: string,
  email: string,
  state: string,
  passwordHash: string,
  token: string
}

const schema = new Schema<UserType>({ 
  name: String,
  email: { type: String, required: true },
  state: String,
  passwordHash: String,
  token: String,
})

const modelName: string = 'User';

const userModel = (connection && connection.models[modelName]) ?
  connection.models[modelName] as Model<UserType> :
  model<UserType>(modelName, schema)

export default userModel;