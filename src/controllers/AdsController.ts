import {Request, Response} from 'express';
import Category from '../models/Category';
import dotenv from 'dotenv';
import User from '../models/User';
import Ad from '../models/Ad';
import { v4 as uuidv4 } from 'uuid';
import jimp from 'jimp';
import State from '../models/State';
import mongoose from 'mongoose';

dotenv.config();

type Filter = {
  status?: string,
  title?: any,
  category?: string,
  state?: string
}

type AdType = {
  status?: string,
  title?: any,
  category?: string,
  state?: string,
  description?: string,
  price?: number,
  priceNegotiable?: boolean,
  images?: [{url: string, default: boolean}]
}

const addImage = async (buffer: any) => {
  let newName = `${uuidv4()}.jpg`;
  let tmpImg = await jimp.read(buffer);
  tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`)
  console.log("NewNAme: ", newName);
  return newName;
}

export default {
  getCategories: async (req: Request, res: Response) => {
    const cats = await Category.find();

    let categories = [];

    for (const i in cats) {
      categories.push({
        _id: cats[i]._id,
        name: cats[i].name,
        slug: cats[i].slug,
        img: `${process.env.BASE}/static/assets/images/${cats[i].slug}.png`
      })
    }
    console.log("Cats: ", categories);
    
    res.json({categories});
  },
  addAction: async (req: Request, res: Response) => {

    let { title, price, priceneg, desc, cat, token } = req.body;

    const user = await User.findOne({token}).exec();

    if(!user){
      res.json({error: 'Sem user.'})
      return;
    }

    if (!title || !cat ) {
      res.json({error: 'Título e/ou categoria não foram preenchidos.'})
      return;
    }

    if(cat.length < 12) {
      res.json({error: 'Id de Categoria Inválido.'})
      return;
    }

    if(mongoose.Types.ObjectId.isValid(cat)){
      const category = await Category.findById(cat);
      if(!category) {
        res.json({error: 'Categoria Inexistente.'})
        return;
      }
    } else {
      res.json({error: 'Id de Categoria Inválido!'})
      return;
    }

    if(price){
      price = price.replace('.','').replace(',','.').replace('R$ ','');
      price = parseFloat(price);
    } else {
      price = 0;
    }

    const newAd = new Ad();

    newAd.status = 'true';
    newAd.idUser = user._id as unknown as string;
    newAd.state = user.state;
    newAd.dateCreated = new Date();
    newAd.title = title;
    newAd.category = cat;
    newAd.price = price;
    newAd.priceNegotiable = (priceneg=='true') ? true : false;
    newAd.description = desc;
    newAd.views = 0;

    if( req.files && req.files.img ){
      
      let image: any = req.files.img;
      if (image.length == undefined) {
        if (['image/jpeg','image/jpg','image/png'].includes(image.mimetype)) {
          let url = await addImage(image.data);
          newAd.images.push({url, default: false});
          console.log("Aqui ", url);          
        }
      }else {
        for (let i = 0; i < image.length; i++) {          
          if (['image/jpeg','image/jpg','image/png'].includes(image[i].mimetype)) {
            let url = await addImage(image[i].data);
            newAd.images.push({url, default: false});
            console.log("Aqui2");            
          }
        }
      }
    }
    if(newAd.images.length > 0){
     newAd.images[0].default = true;
    }
    const info = await newAd.save();
    res.json({id: info})
  },
  getList: async (req: Request, res: Response) => {
    
    let {sort = 'asc', offset = 0, limit = 8, q, cat, state} = req.query;

    let filters: Filter = {status: 'true'};

    let total = 0;

    if(q) {
      filters.title = {'$regex': q, '$options':'i'};
    }

    if(cat) {
      const c = await Category.findOne({slug: cat}).exec();
      if (c){
        filters.category = c._id.toString();
      }
    }

    if( state && typeof state === 'string') {
      let estado: string = state;
      const s = await State.findOne({name: estado.toUpperCase()}).exec();
      if (s){
        filters.state = s._id.toString();
      }
    }    

    const adsTotal = await Ad.find(filters).exec();

    total = adsTotal.length;

    const adsData = await Ad.find(filters)
      .sort({dateCreated: (sort==='desc'?-1:1)})
      .skip(parseInt(offset as string))
      .limit(parseInt(limit as string))
      .exec();
    let ads = [];
    
    for (const i of adsData) {

      let image;

      let deafaultImg = i.images.find(e => e.default);

      if ( deafaultImg ){
        image = `${process.env.BASE}/static/media/${deafaultImg.url}`;
      } else {
        image = `${process.env.BASE}/static/media/default.jpg`;
      }

      ads.push({
        id: i._id,
        title:i.title, 
        price:i.price,
        priceNegotiable: i.priceNegotiable,
        image
      })
    }

    res.json({ads, total})

  },
  getItem: async (req: Request, res: Response) => {
    let { id, other = null } = req.query;

    if(!id){
      res.json({error: 'Sem produto'})
      return;
    }
    let id2 = id as string;

    if( id2.length < 12){
      res.json({error: 'ID inválido'})
      return;
    }
    const ad = await Ad.findById(id);
    if(!ad){
      res.json({error: 'Produto inexistente'})
      return;
    }

    ad.views++;
    await ad.save();

    let images = [];
    for (const item of ad.images) {
      images.push(`${process.env.BASE}/static/media/${item.url}`);
    }

    let category = await Category.findById(ad.category).exec();
    let userInfo = await User.findById(ad.idUser).exec();
    let stateInfo = await State.findById(ad.state).exec();

    let others = [];

    if (other) {
      const otherData = await Ad.find({status: true, idUser: ad.idUser}).exec();

      for (const item of otherData) {
        if (item._id.toString() !== ad._id.toString()) {
          
          let image = `${process.env.BASE}/static/media/default.jpg`;

          let defaultImg = item.images.find(e => e.default);

          if (defaultImg) {
            image = `${process.env.BASE}/static/media/${defaultImg.url}`;
          }

          others.push({
            id: item._id,
            title: item.title,
            price: item.price,
            priceNegotiable: item.priceNegotiable,
            image
          })
        }
      }
    }

    res.json({
      id: ad._id,
      title: ad.title,
      price: ad.price,
      priceNegotiable: ad.priceNegotiable,
      description: ad.description,
      dateCreated: ad.dateCreated,
      views: ad.views,
      images,
      category,
      userInfo: {
        name: userInfo?.name,
        email: userInfo?.email
      },
      stateName: stateInfo?.name,
      others
    })
  },
  editAction: async (req: Request, res: Response) => {
    let { id } = req.params;
    let { title, status, price, priceneg, desc, cat, token } = req.body;

    if (id.length < 12) {
      res.json({error: 'ID inválido'})
      return;
    }

    let ad = await Ad.findById(id).exec();

    if(!ad) {
      res.json({error: 'Anúncio inexistente!'});
      return;
    }

    const user = await User.findOne({token}).exec();

    if(user){
      if (user._id.toString() !== ad.idUser) {
        res.json({error: 'Este anúncio não é seu!'});
        return;
      }
    }

    let updates: AdType  = {};

    if(title){
      updates.title = title
    }

    if(price){
      price = price.replace('.','').replace(',','.').replace('R$ ','');
      price = parseFloat(price);
      updates.price = price;
    }

    if(priceneg){
      updates.priceNegotiable = priceneg;
    }

    if(status){
      updates.status = status;
    }

    if(desc){
      updates.description = desc;
    }

    if(cat){
      const category = await Category.findOne({slug: cat}).exec();
      if(!category){
        res.json({error: 'Categoria inexistente!'});
        return;
      }

      updates.category = category._id.toString();
    }             

    let result = await Ad.findByIdAndUpdate(id, {$set: updates});

    let ad2 = await Ad.findById(id);

    updates = {};
    console.log("ad2, ", ad2);
    
    if (ad2) {
      let images = [];

      for (const item of ad.images) {
        images.push({url: item.url, default: item.default});
      }
      console.log("Images: ", images);
      
      if( req.files && req.files.img ){
      
        let image: any = req.files.img;

        console.log("Image, ", image);
        
        if (image.length === undefined) {
          if (['image/jpeg','image/jpg','image/png'].includes(image.mimetype)) {
            let url = await addImage(image.data);
            images.push({url, default: false});
            console.log("Aqui ", url);          
          }   
        }else {
          for (let i = 0; i < image.length; i++) {          
            if (['image/jpeg','image/jpg','image/png'].includes(image[i].mimetype)) {
              let url = await addImage(image[i].data);
              images.push({url, default: false});
              console.log("Aqui2");            
            }
          }          
        }
        await Ad.findByIdAndUpdate(id, {images})
      }
    }


    res.json({error: 'ok', result});
  }
}