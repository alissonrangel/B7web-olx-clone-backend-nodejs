import {NextFunction, Request, Response} from 'express';
import User from '../models/User';


export default {
  private: async (req: Request, res: Response, next: NextFunction) => {

    if (!req.query.token && !req.body.token) {
      res.json({notAllowed: true});      
      return; 
    }

    let token = '';

    if (req.query.token){
      token = req.query.token as string;
    }
    if (req.body.token){
      token = req.body.token as string;
    }

    if (token === ''){
      res.json({notAllowed: true});      
      return; 
    }

    const user = await User.findOne({token})
    console.log("User: ", user);
    
    if (!user) {
      res.json({notAllowed: true});      
      return;
    }

    next();
  }
}