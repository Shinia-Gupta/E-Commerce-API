import { ObjectId } from 'mongodb';
import {getDB} from '../../config/mongodb.js';
import OrderModel from './order.model.js';
import { getClient } from '../../config/mongodb.js';
import {ApplicationError} from '../../error-handler/applicationError.js';
export default class OrderRepository{

    constructor(){
        this.collection='orders';
    }

    async placeOrder(userId){
        const client=getClient();
        const session=client.startSession();
        try {

    const db=getDB();     
    session.startTransaction();

        // 1. Get cart items and calculate total amount 
const items=await this.getTotalAmount(userId,session);
const finalAmountOfOrder= items.reduce((acc,item)=>{
    return acc+item.totalAmount;
},0);

//2. Create an order record 
const neworder=new OrderModel(new ObjectId(userId),finalAmountOfOrder,new Date());
await db.collection(this.collection).insertOne(neworder,{session});

//3. Reduce the stock
for(let item of items){
    await db.collection('products').updateOne({_id:item.productID},{
        $inc:{stock: -item.quantity}
    },{session})
}

//just for demo of transactions
// throw new ApplicationError('Something is wrong',500);

//4. Clear the cart items 
await db.collection('cart').deleteMany({userID:new ObjectId(userId)},{session});
await session.commitTransaction();

} catch (error) {
    await session.abortTransaction();
    // session.endSession();
    console.log(error);
    throw new ApplicationError("Database Error",500);

}finally{
    session.endSession();
    client.close();

}

    }

    async getTotalAmount(userId,session){
        const db=getDB();
      const items=await  db.collection("cart").aggregate([

            // 1. Get cart items for a particular user 
            {
                $match:{userID:new ObjectId(userId)}
            },
    
            //2. now we have got all cart items which right now only contain the product id and not the whole product document, so we need to get all the products documents which have the product ids in the order by a user
//SO, we will get the products from products collection based on the cart's productID and the products's _id match using left outer join
{

    //attaching the product as a nested object to each cart item, showing that this very cart item is this very product in that cart
$lookup:{
    from:'products',
    localField:"productID",
    foreignField:"_id",
    as:"productInfo"
}
},

//3. create a single array after attaching the nested object to the cart item i.e. unwind the productInfo
{
$unwind:"$productInfo"
},

//4. calculate total amount for these cart items by multiplying the quantity with price of individual item and then adding them
{
    $addFields:{
        "totalAmount":{
            $multiply:["$productInfo.price","$quantity"]
        }
    }
}
        ],{session}).toArray();
return items;
        // console.log(items);
        // console.log(finalAmountOfOrder);

    }
}

