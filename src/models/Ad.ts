import { Schema, Model, model, connection } from 'mongoose';

type AdType = {
  idUser: string,
  state: string,
  category: string,
  images: [{
    url: string,
    default: boolean,
  }],
  dateCreated: Date,
  title: string,
  price: number,
  priceNegotiable: boolean,
  description: string,
  views: number,
  status: string,
}

const schema = new Schema<AdType>({ 
  idUser: String,
  state: String,
  category: { type: String, required: true },
  images: [{
    url: String,
    default: Boolean
  }],
  dateCreated: Date,
  title: { type: String, required: true },
  price: Number,
  priceNegotiable: Boolean,
  description: String,
  views: Number,
  status: String,
})

const modelName: string = 'Ad';

const adModel = (connection && connection.models[modelName]) ?
  connection.models[modelName] as Model<AdType> :
  model<AdType>(modelName, schema)

export default adModel;