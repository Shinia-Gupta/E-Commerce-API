import express from 'express';
import ProductController from './product.controller.js';
import {upload} from '../../middlewares/fileupload.middleware.js'

//1. Initialize the express router
//ROLE-specifies the path i.e when "this" path matches,call "this" controller method
const productRouter=express.Router();

const productController=new ProductController();

//initiated localhost:3000/api/products in server.js + these routes on call
productRouter.get('/',(req,res)=>productController.getAllProducts(req,res));
productRouter.post('/',upload.single('imageUrl'),(req,res)=>productController.addProduct(req,res));
productRouter.get('/getOne/:id',(req,res)=>productController.getOneProduct(req,res));
productRouter.get('/filters',(req,res)=>productController.filterProducts(req,res));
productRouter.post('/rate',(req,res,next)=>productController.rateProduct(req,res,next));
productRouter.get('/averageprice',(req,res,next)=>productController.averagePrice(req,res,next));
export default productRouter;