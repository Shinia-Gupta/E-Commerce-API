import OrderRepository from "./order.repository.js";



export default class OrderController{

    constructor(){
        this.orderRepo=new OrderRepository();
    }

    async placeOrder(req,res,next){
        try {
            const userId=req.userID;
           await this.orderRepo.placeOrder(userId);
            res.status(201).send('order created successfully');
        } catch (error) {
            console.log(error);
            return res.status(200).send("Something went wrong");
        }
    }
}