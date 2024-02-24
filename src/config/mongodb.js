
import { MongoClient } from "mongodb";

const url=process.env.DB_URL;
let client;
export const connectToMongodb=()=>{
    MongoClient.connect(url)
    .then(clientInstance=>{
        client=clientInstance;
        console.log('MongoDB is connected!');
        createCounter(client.db());
        createIndexes(client.db());
    })
    .catch(err=>{
        console.log(err);
    })
}

export const getDB=()=>{
    return client.db();
}

export const getClient=()=>{
    return client;
}

export const createCounter=async (db)=>{
    const existingCounter=await db.collection('counters').findOne({_id:'cartId'});
    if(!existingCounter){
        await db.collection('counters').insertOne({_id:'cartId',value:0});
    }

}
export const createIndexes=async(db)=>{
    try {
        //Single field index on price field of products collection in ascending order
        await db.collection('products').createIndex({price:-1});

        //compound field index on name and category field of products collection in ascending order
        await db.collection('products').createIndex({name:1,category:1});

        //text field indexing on description field of products collection in descending order
        await db.collection('products').createIndex({desc:"text"});

    } catch (error) {
        console.log(error);

    }
}

