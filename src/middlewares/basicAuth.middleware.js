import UserModel from "../features/user/user.model.js";


const basicAuthorizer=(req,res,next)=>{

    //1. Check if authorization header is empty.

    const authHeader=req.headers["authorization"];
console.log('The auth header '+authHeader);
    if(!authHeader){
        return res.status(401).send('No authorization details found! ');
    }

    //2. Extract the credentials [Basic dfgdf56ggsdfr34terfsd];
    const base64Credentials=authHeader.replace('Basic ','');
console.log('base64Credentials '+base64Credentials);

    //3. Decode the credentials
const decodedCreds=Buffer.from(base64Credentials, 'base64').toString('utf8');
console.log('Decoded credentials '+decodedCreds);  //[username:password]
const creds=decodedCreds.split(':');
const user=UserModel.getAll().find(u=>u.email==creds[0] && u.password==creds[1]);
if(user){
    next();
}else{
    //status 401-unauthorized request!
    return res.status(401).send('Incorrect credentials')
}

}

export default basicAuthorizer;