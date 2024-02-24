import express from 'express';
import LikeController from './like.controller.js';

const likeRouter=express.Router();

const likeController=new LikeController();
likeRouter.get('/',(req,res)=>likeController.getLikes(req,res));
likeRouter.post('/',(req,res)=>likeController.likeItem(req,res));
export default likeRouter;