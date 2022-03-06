import {Request, Response} from 'express';
import Category from '../models/Category';
import dotenv from 'dotenv';
import User from '../models/User';
import Ad from '../models/Ad';
import { v4 as uuidv4 } from 'uuid';
import jimp from 'jimp';
import State from '../models/State';

dotenv.config();

type Filter = {
  status?: string,
  title?: any,
  category?: string,
  state?: string
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
      stateName: stateInfo?.name
    })
  },
  editAction: async (req: Request, res: Response) => {
    
  }
}