import express from 'express';
import { CartController } from './cart.controller.js';

const cartRouter=express.Router();
const cartController=new CartController();

cartRouter.post('/',(req,res,next)=>cartController.addIntoCart(req,res,next));
cartRouter.get('/',(req,res,next)=>cartController.getCartItemsByUser(req,res,next));
cartRouter.delete('/:id',(req,res,next)=>cartController.deleteFromCart(req,res,next));
export default cartRouter;