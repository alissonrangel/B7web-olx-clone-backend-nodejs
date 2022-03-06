import { Schema, Model, model, connection } from 'mongoose';

type CategoryType = {
  name: string,
  slug: string
}

const schema = new Schema<CategoryType>({ 
  name: String,
  slug: String,
})

const modelName: string = 'Category';

const catModel = (connection && connection.models[modelName]) ?
  connection.models[modelName] as Model<CategoryType> :
  model<CategoryType>(modelName, schema)

export default catModel;