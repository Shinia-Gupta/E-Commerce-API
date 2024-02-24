import jwt from 'jsonwebtoken';

const jwtAuth=(req,res,next)=>{
    // 1. Read the token 
const token=req.headers['authorization'];

    //2. if no token, return the error
if(!token){
    return res.status(401).send('Unauthorized!');
}
    //3. check if token is valid
     //if valid, call next middleware
    //else, return error
try {
    const payload=jwt.verify(token,process.env.JWT_SECRET);
console.log(payload);
req.userID=payload.userID;
} catch (error) {   //errors can be caused by invalid token or token expiration or token modification
    return res.status(401).send('Unauthorized!');

}
   next();
}

export default jwtAuth;