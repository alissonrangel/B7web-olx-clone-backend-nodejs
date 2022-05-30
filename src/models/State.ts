import { Schema, Model, model, connection } from 'mongoose';

type StateType = {
  name: string,
}

const schema = new Schema<StateType>({ 
  name: String,
})

const modelName: string = 'State';

const stateModel = (connection && connection.models[modelName]) ?
  connection.models[modelName] as Model<StateType> :
  model<StateType>(modelName, schema)

export default stateModel;