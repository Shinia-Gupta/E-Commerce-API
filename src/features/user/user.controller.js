import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
// import { log } from "winston";
export default class UserController {
  constructor() {
    this.repository = new UserRepository();
  }

async resetPassword(req,res){
  const {newPassword}=req.body;
  const hashedPassword=await bcrypt.hash(newPassword,12);
const userID=req.userID;
  try {

await this.repository.resetPassword(userID,hashedPassword);
res.status(200).send("Password updated successfully");

} catch (error) {
  console.log("Something wrong in controller ",error);
  res.status(500).send("Something went wrong");
}
}




  async signUp(req, res) {
try {
  const { name, email, password, type } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const addedUser = new UserModel(name, email,hashedPassword, type);
  await this.repository.signup(addedUser);
  res.status(201).send(addedUser);
} catch (error) {
console.log(error);
res.status(400).send(error.message);

}
  }

  async signIn(req, res, next) {
    try {
      const user = await this.repository.findByEmail(req.body.email);
      if (!user) {
        res.status(400).send("Incorrect Credentials! ");
      } else {
        //compare password with hashed password
        const matchedPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (matchedPassword) {
          // 1. Create token
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "2h",
            }
          );
          res.status(200).send(token);
        } else {
          res.status(400).send("Incorrect Credentials! ");
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
