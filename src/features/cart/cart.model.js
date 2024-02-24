

export default class CartModel{

    constructor(productID,userID,quantity,id){
        this.productID=productID;
        this.userID=userID;
        this.quantity=quantity;
        this.id=id;
    }

//    static add(productID,userID,quantity){
//        const cartItem=new CartModel(productID,userID,quantity);
//        cartItem.id=cart.length+1;
//        cart.push(cartItem);
//        return cartItem; 
//     }

    // static getCartByUser(userID)
    // {
    //     return cart.filter(c=>c.userID==userID);
    // }

    // static delete(cartId,userID){
    //     const cartItemIndex=cart.findIndex(i=>i.id==cartId && i.userID==userID);
    //     if(cartItemIndex==-1){
    //         return 'item not found!';
    //     }else{
    //         cart.splice(cartItemIndex,1);
    //     }
    // }
}



var cart=[
    new CartModel(1,1,2,1),
    new CartModel(2,2,4,2),
    new CartModel(3,2,2,2)
]