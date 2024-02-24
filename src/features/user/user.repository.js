import mongoose from "mongoose";
import {userSchema} from './user.schema.js';
import {ApplicationError} from '../../error-handler/applicationError.js';
const UserModel=mongoose.model('User',userSchema);

export default class UserRepository{


    async signup(user){
try {
    
const newUser=new UserModel(user);
await newUser.save();
} catch (error) {
    if(error instanceof mongoose.Error.ValidationError){
        throw error;
    }else{
        console.log(error);
        throw new ApplicationError('Something went wrong in database',500);
    }}

    }

    async signin(email,password){
        try {
return await UserModel.findOne({email,password});
            } catch (error) {
                console.log(error);
                throw new ApplicationError('Something went wrong in database',500);
            }
            
    }

    async findByEmail(email) {
        try {
        
         return await UserModel.findOne({email});
              } catch (err) {
          console.log(err);
          throw new ApplicationError("Something went wrong with the database", 500);
        }
      }


      async resetPassword(userID,hashedPassword){
        try {
            //method1
            // await UserModel.updateOne({_id:userID},{password:hashedPassword});

            //method 2
            const user=await UserModel.findById(userID);
            if(user){
                user.password=hashedPassword;
                user.save();
            }else{
                throw new Error("No such user found"); 
            }
            
        } catch (error) {
           
                console.log(error);
                throw new ApplicationError('Something went wrong in database',500);
                    }
      }
}

