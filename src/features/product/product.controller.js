import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor(){
    this.productRepo=new ProductRepository();
  }

  async getAllProducts(req, res) {
  try {
    const products = await this.productRepo.getAllProd();
    res.status(200).send(products);
  } catch (error) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
  }

  async getOneProduct(req, res) {
    const id = req.params.id;
    let prodFound = await this.productRepo.getOneProd(id);
    if (prodFound) {
      res.status(200).send(prodFound);
    } else {
      res.status(404).send("Product not found!");
    }
  }

 async addProduct(req, res) {
    // console.log(req.body);
    // console.log('A POST request');
    // res.status(200).send('post request recieved!!');
    try{
    const { name,desc, price,categories, sizes } = req.body;
    const newProduct =new ProductModel(
      name,desc,
      parseFloat(price),
      req.file.filename,
      categories,
      sizes.split(",")
     
    );
    const addedProduct =await this.productRepo.addProd(newProduct);
    res.status(201).send(addedProduct);
  }catch(err){
    console.log(err);
    res.status(500).send("Something went wrong");
  }
}

  async rateProduct(req, res,next) {
    try {
      const userID=req.userID;
      const { productID, rating } = req.body;
      await this.productRepo.rateProduct(userID, productID, rating);
      // return product;
     return res.status(200).send("Rating added");
    } catch (error) {
      // res.status(400).send(error.message);
console.log(error.message);
next(error);
    }
    // return res.status(200).send("Ratings added by the user!");
    
  }

  async filterProducts(req, res) {
try {
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const category = req.query.category;
  const filteredProd = await this.productRepo.filterProd(minPrice, maxPrice, category);
  if (filteredProd) {
    res.status(200).send(filteredProd);
  } else {
    res.status(404).send("No products found!");
  }
} catch (error) {
  res.status(400).send(error.message);

}
  }


async averagePrice(req,res,next){
  try {
    const result=await this.productRepo.averageProductPricePerCategory();
    res.status(200).send(result);
  } catch (error) {
console.log(error);
    res.status(400).send(error.message);
    
  }
}
}
