import mongoose from "mongoose";


export const likeSchema=new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
likeable:{
    type:mongoose.Schema.Types.ObjectId,
    refPath:"on_model"
},
on_model:{
    type:String,
    enum:["Product","Category"]
}
}).pre('save',(next)=>{
console.log("New like coming in");
    next();
})
.post('save',(doc)=>{
    console.log("like saved");
    console.log(doc);
})
.pre('find',(next)=>{
    console.log("Retrieving the likes...");
    next();
})
.post('find',(doc)=>
{
    console.log("Likes fetched");
    console.log(doc);
})