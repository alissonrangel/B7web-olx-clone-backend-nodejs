import {Request, Response} from 'express';
import Ad from '../models/Ad';
import Category from '../models/Category';
import State from '../models/State';
import User from '../models/User';
import {matchedData, validationResult} from 'express-validator'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

type UserType = {
  name?: string,
  email?: string,
  state?: string,
  passwordHash?: string,
  token: string
}

export default {
  getStates: async (req: Request, res: Response) => {

    let states = await State.find({});

    res.json({states});
    
  },
  info: async (req: Request, res: Response) => {

    let token = req.query.token;
    let user = await User.findOne({token});
    if (user){
      const state = await State.findById(user.state);
      const ads = await Ad.find({idUser: user._id.toString()});      

      let adList = [];
      for (const item of ads) {

        const category = await Category.findById(item.category);

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
          adList.push({...item, category: category.slug})
        }
      }

      if(state && ads){
        res.json({
                name: user.name, 
                email: user.email,
                state: state.name,
                ads: adList,
              });
        return;
      } else {
        res.json({error: "no state/ no ads"})
      }
    } else {
      res.json({error: "no user"})
      return;
    }    
  },
  editAction: async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.json({error: errors.mapped()});
      return;
    }
    const data = matchedData(req);

    let token = data.token;
    let updates: UserType = {token}

    if(data.name){
      updates.name = data.name;
    }
    if(data.email){
      const emailCheck = await User.findOne({email: data.email});
      if(emailCheck){
        res.json({error: 'E-mail já existente'});
        return;
      } else {
        updates.email = data.email;
      }
    }

    if(data.state){
      if(mongoose.Types.ObjectId.isValid(data.state)){
        const stateCheck = await State.findById(data.state);
        console.log("State:, ", stateCheck);
        
        if(!stateCheck){
          res.json({error: 'Estado não existente'});
          return;
        } else {
          updates.state = data.state;
        }
      }else {
        res.json({
          error: {state: {msg: "Código de estado inválido!"}}
        });
        return;
      } 
    }

    if(data.password){
      updates.passwordHash = await bcrypt.hash(data.password, 11);
    }
      
    let result = await User.findOneAndUpdate({token},{$set: updates})
    

    res.json({result})
  }
}