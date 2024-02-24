import { LikeRepository } from "./like.repository.js";



export default class LikeController{
constructor(){
    this.likeRepo=new LikeRepository();
}
async likeItem(req,res){
try {
    const {id,type}=req.body;
    if(type!="Product" && type!='Category'){
        return res.status(400).send("Invalid Item");
    }
    if(type=='Product'){
await this.likeRepo.likeProduct(req.userID,id);
res.status(201).send("Like added to product");
    }else{
        await this.likeRepo.likeCategory(req.userID,id);
        res.status(201).send("Like added to category");
                
    }
} catch (error) {
    console.log(error);
    res.status(200).send("Like could not be added");
}

}

async getLikes(req,res){
    try {
        const {id,type}=req.query;
        const likes=await this.likeRepo.getLikes(type,id);
        res.status(200).send(likes);
    } catch (error) {
        console.log(error);
        res.status(200).send("Like could not be fetched");
            
    }
}

}