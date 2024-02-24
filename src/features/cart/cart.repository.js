import { ObjectId } from 'mongodb';
import {getDB} from '../../config/mongodb.js';
import {ApplicationError} from '../../error-handler/applicationError.js';

export default class CartRepository{
constructor(){
    this.collection='cart';
}

    async add(userID,productID,quantity){
try {
    const db=getDB();
    const collection=db.collection(this.collection);
const id=await this.getNextCounter(db);
//find the document
//either insert or update the quantity
await collection.updateOne(
    {userID:new ObjectId(userID),productID:new ObjectId(productID)},
    {
        //we want to use the counter id only on insert and not on update, so use atteibute-setOnInsert
        $setOnInsert:{_id:id},
        $inc:{
        quantity:parseFloat(quantity)
    }},
    {upsert:true}
    );



    // await collection.insertOne({userID:new ObjectId(userID),productID:new ObjectId(productID),quantity});
    // return cartItem;
} catch (error) {
    console.log(error);
    throw new ApplicationError('Database error',500);
}
    }

    async getCartByUser(userID){
        try {
            const db=getDB();
            const collection=db.collection(this.collection);  
            return await collection.find({userID:new ObjectId(userID)}).toArray();

        } catch (error) {
            console.log(error);
            throw new ApplicationError('Database error',500);
                    
        }
    }

    async delete(productID,userID){
        try {
            const db=getDB();
            const collection=db.collection(this.collection);  
             const result=await collection.deleteOne({productID:new ObjectId(productID),userID:new ObjectId(userID)});
             return result.deletedCount>0;
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Database error',500);
              
        }
    }

async getNextCounter(db){
   const resultDocument= await db.collection('counters').findOneAndUpdate(
        {_id:'cartId'},
        {$inc:{value:1}},
        {returnDocument:"after"}
        )
        console.log(resultDocument);
        return resultDocument.value;
}

}