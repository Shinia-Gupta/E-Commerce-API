import './env.js';
import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import cors from 'cors';
// import dotenv from 'dotenv';

import productRouter from './src/features/product/product.routes.js'
import userRouter from './src/features/user/user.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cart.routes.js';
// import apiDocs from './swagger.json' assert {type:'json'};
import apiDocs from './swagger3.json' assert {type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
// import {connectToMongodb} from './src/config/mongodb.js';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongoose.js';
import { mongo } from 'mongoose';
import mongoose from 'mongoose';
import likeRouter from './src/features/like/like.routes.js';

const server=express();

//load all the environment variables in our application
// dotenv.config();

//CORS Policy Configuration using headers
// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','http://localhost:5500');  //to give access to all the web clients, we can use * in place of localhost url
//     res.header('Access-Control-Allow-Headers','Content-Type,Authorization'); //allowing content-type and authorization headers of the request to be accessed or use * to allow all headers to be accessed
//     res.header('Access-Control-Allow-Methods','*');    //specify what all methods a client(browser) can access
//     //return ok for preflight requests
//     if(req.method=='OPTIONS'){
//         return res.sendStatus(200);
//     }
// next();
// });

//CORS Policy configuration using cors library
const corsOptions={
    origin:'http://localhost:5500',
    
}
server.use(cors(corsOptions));



//convert any PUT/POST request data from the clients into server readable form like urlencoded or json 
server.use(bodyParser.json());
server.use(loggerMiddleware);
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
//for all requests related to products, redirect to product routes
// server.use('/api/products',basicAuthorizer,productRouter);
server.use('/api/products',jwtAuth,productRouter);

server.use('/api/users',userRouter);

server.use('/api/cart',jwtAuth,cartRouter);
server.use('/api/orders',jwtAuth,orderRouter);
server.use('/api/likes',jwtAuth,likeRouter);

server.get('/',(req,res)=>{
    res.send('Welcome to Ecommerce APIs');
})
//Error handler middleware
server.use((err,req,res,next)=>
{
    if(err instanceof mongoose.Error.ValidationError){
     return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
      return res.status(err.code).send(err.message);
    }

    console.log(err);
    res.status(500).send("Something Went Wrong! Please try again later");
})


//MIDDLEWARE TO HANDLE 404 REQUESTS...should be handled in end to ensure it first goes through all the about api routes
server.use((req,res)=>{
    res.status(404).send('API not found!Please check our documentation for more information at http://localhost:3100/api-docs ');
})
server.listen(3100,()=>{
    console.log('Server is listening at port 3100');
    // connectToMongodb();
    connectUsingMongoose();
})