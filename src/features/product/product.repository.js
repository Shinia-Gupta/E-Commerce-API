import mongoose from "mongoose";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./reviews.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel=mongoose.model("Product",productSchema);
const ReviewModel=mongoose.model("Review",reviewSchema);
const CategoryModel=mongoose.model("Category",categorySchema);


class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async getAllProd() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong in database!", 500);
    }
  }

  async addProd(product) {
    try {
      // const db = getDB();
      // const collection = db.collection(this.collection);
      // await collection.insertOne(product);
      // return product;
product.categories=product.category.split(',');
      const newProduct=new ProductModel(product);
      const savedProduct=await newProduct.save();
      await CategoryModel.updateMany(
        {_id:{$in:product.categories}},
        {$push:{products:new ObjectId(savedProduct._id)}}
      )
      return newProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async getOneProd(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong in database!", 500);
    }
  }

  async filterProd(minPrice, maxPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      // if (category) {
      //   // filterExpression.category = category;
      //   // filterExpression={$and:[{category:category},filterExpression]};
      //   filterExpression={$or:[{category:category},filterExpression]};
      // }

      //filtering multiple sizes from an array of categories
categories=JSON.parse(categories.replace(/'/g,'"'));
// console.log(categories);
      if(categories){
        filterExpression={$or:[{category:{$in:categories}},filterExpression]};
      }
      // return collection.find(filterExpression).toArray();

      //only displaying some specific fields of the result 
return collection.find(filterExpression).project({name:1,price:1,sizes:{$slice:2},_id:0}).toArray();

    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async rateProduct(userID, productID, rating) {
    try {
 //1. Check if product exists
 const prodToUpdate=await ProductModel.findById(productID);
 if(!prodToUpdate){
  throw new Error("Product not found");
 }

 //Find the existing review
 const userReview=await ReviewModel.findOne({product:new ObjectId(productID),user:new ObjectId(userID)});
if(userReview){
  userReview.rating=rating;
  userReview.save();
}else{
  const newReview=new ReviewModel({
    product:new ObjectId(productID),
    user:new ObjectId(userID),
    rating:rating
  });
  newReview.save();
}

    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){
        throw error;
      }else{
      console.log(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
  }

  async averageProductPricePerCategory(){
   try {
    const db=getDB();
   return await db.collection(this.collection).aggregate([
      {
        //Stage 1: Get average price per category
        $group:{_id:"$category",averagePrice:{$avg:"$price"}} 
      }
    ]).toArray();
   } catch (error) {
    console.log(error);
    throw new ApplicationError("Database Error",500);
   }
  }


  //this function was executed in mongo shell,no routes or controller for it exist. Check APIList file for its execution in mongosh and other functions also 
  async averageRatingInEachProduct(){
    try {
      const db=getDB();
return await db.collection(this.collection).aggregate([

  {
    $unwind:"$ratings"
  },
  {
    $group:{_id:"name",averageRating:{$avg:"$ratings.rating"}}
  }
]
)

    } catch (error) {
      console.log(error);
    throw new ApplicationError("Database Error",500);

    }
  }
}

export default ProductRepository;
