import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export class CartController{
constructor(){
    this.cartRepo=new CartRepository();
}

    async addIntoCart(req,res){
        try {
            const {productID,quantity}=req.body;
        const userID=req.userID;
        // const cartItem=new CartModel(productID,userID,quantity);
       await this.cartRepo.add(userID,productID,quantity) 
        // console.log(itemAdded);
        res.status(201).send('Cart Updated Successfully');
        
        } catch (error) {
            res.status(500).send("Something went wrong");
        }
    }

   async getCartItemsByUser(req,res){
    try {
        
        const userID=req.userID;
        const cartItems=await this.cartRepo.getCartByUser(userID);
        return res.status(200).send(cartItems);
    } catch (error) {
        res.status(500).send("Something went wrong");
        
    }
    }

    deleteFromCart(req,res){
        const userID=req.userID;
        const productID=req.params.id;
        const deletedItemCount=this.cartRepo.delete(productID,userID);
        if(!deletedItemCount){
            return res.status(404).send("Item not found");
        }else{
            return res.status(200).send("Cart item deleted successfully! ");
            
        }
    }
}