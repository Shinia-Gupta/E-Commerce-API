import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  static getAll() {
    return users;
  }

//   static async SignUp(name, email, password, type) {
//     try {
//       // 1. Get the DB
//       const db = getDB();

//       //2. Get the collection
//       const collection = db.collection("users");

//       // const id=users.length+1;
//       const newUser = new UserModel(name, email, password, type);
//       // users.push(newUser);
//       //3. Insert the document
//       await collection.insertOne(newUser);
//       return newUser;
//     } catch (err) {
//       throw new ApplicationError("Something went wrong", 500);
//     }
//   }

//   static SignIn(email, password) {
//     const user = users.find((u) => {
//       return u.email == email && u.password == password;
//     });
//     return user;
//   }
}

var users = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@ecom.com",
    password: "Seller1",
    type: "seller",
  },
  {
    id: 2,
    name: "customer User",
    email: "customer@ecom.com",
    password: "customer1",
    type: "customer",
  },
];
