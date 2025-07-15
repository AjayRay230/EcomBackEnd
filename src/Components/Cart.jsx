import MyContext from "../Context/Context"
import axios from "axios";
import CheckOutPop from "./CheckOutPop";
import { useContext, useEffect, useState } from "react";

const CART =()=>{
const {cart,removeFromCart,clearCart} = useContext(MyContext);
const[cartItems,SetCartItems] = useState([]);
const[totalPrice,setTotalPrice] = useState(0);
const[cartImage,setCartImage] = useState([]);
const[showModal,setShowModal] = useState(false);

useEffect(()=>{

const fetchImagesAndUpdateCart = async()=>{
    // for debugging purpose
    console.log("cart",cart);
    try{
        const response = await axios.get(`http://localhost:8080/api/product`);
        const backEndProductId = response.data.map((product)=>product.id);
        const updatedCartItems = cart.filter((item)=>backEndProductId.includes(item.id));
        const cartItemsWithImages = await Promise.all(
            updatedCartItems.map(async (item)=>
            {
                try{
                    const response = await axios.get(`http://localhost:8080/api/product/${item.id}/image`, 
                        {responseType:"blob"});
                    const imageFile = await convertUrlToFile(response.data,response.data.imageName);
                    setCartImage(imageFile);
                    const imageUrl = URL.createObjectURL(response.data);
                    return {...item,imageUrl};
                }
                catch(error)
                {
                    console.error("Error fetching image",error);
                    return {...item,imageUrl:"placeholder-image-url"};
                }
            })
        );
        SetCartItems(cartItemsWithImages);
        
        


    }
    catch(error)
    {
        console.error("Error whilte fetching product data",error);
    }
};
if(cart.length)
{
    fetchImagesAndUpdateCart();
}

},[cart]);

//to set the total price in the cart 
useEffect(()=>
{
    // .reduce() method to sum the total price
    //  of all items in the cart.
    const total  = cartItems.reduce(
        (acc,item) =>acc+item.price * item.quantity,0
    );
//  acc stands for accumulator.

// It's a variable that accumulates the result of the calculation.

// In this case, it keeps a running total of the cart price.
    setTotalPrice(total);

},[cartItems]);

const handleUrlToFile = async(blobData,fileName)=>{
    const file = new File([blobData],fileName,{type:blobData.type});
    return file;
}
const handleIncreaseQuantity = (itemId)=>{
    const newCartItems = cartItems.map((item)=>{
        if(item.id===itemId)
        {
            if(item.quantity<item.stockQuantity)
            {
                return {...item,quantity:item.quantity+1};
            }
            else{
                console.log("cannot add more the avialable quantity");
            }
            return item;
        }

        
    });
    SetCartItems(newCartItems);
}
const handleDereasedQuantity = async(itemId)=>
{
    const newCartItems = cartItems.map((item)=>
    item.id===itemId ? {...item,quantity:(item.quantity-1,1)}:item
);
SetCartItems(newCartItems);
}
const handleremoveFromCart = async(itemId)=>
{
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((items)=>
      items.id!==itemId
    );
    SetCartItems(newCartItems);
}
const handleCheckOut = async()=>
{
    try{
    for(const items of cartItems){
            const {imageUrl,imageName,imageData,imageType,quantity,...rest} = items;
            const updatedStockQuantity = items.stockQuantity - items.quantity;
            const updatedProductData = {...rest,stockQuantity:updatedStockQuantity};
            const CartProduct = new FormatData();
            CartProduct.append("imageFile",cartImage);
            CartProduct.append("product",new Blob([JSON.stringify(updatedProductData),{type:"applicatioin/json"}]) );
            await axios.put(`http://localhost:8080/api/product/${items.id}`,CartProduct,
               { header:{
                    "Content-Type" : "multipart/form-data",

                },
            }
            ).then((response)=>
            {
                console.log("Proudct updated successfully: ",(CartProduct));
            }).catch((error)=>{
                console.error("Error while updating product :" ,error);
            });
    }
    clearCart();
    SetCartItems([]);
    setShowModal(false);


}
    catch(error){
        console.log("error while checkot :",error);
    }
}

    return(
        <div className="cart-container">
            <div className="shopping-cart">
                <div className="title">Shopping Bag</div>
                
                {cartItems.length===0?(<div className="empty">
                    
                    <h4>Cart is Empty</h4>
                    
                    </div>
                ):(
                            <>
                            
                            {cartItems.map((items)=>{

                                <div key = {items.id}>
                                    <div>
                                        <img src = {items.imageUrl} alt = {items.name}/>

                                    </div>
                                    <div class = "brand-details">
                                        <span>{items.brand}</span>
                                        <span>{items.name}</span>
                                    </div>
                                    <div className="quantity">
                                        <button onClick={()=>handleIncreaseQuantity(items.id)}>
                                            
                                        </button>
                                        <input type  = "button" name = "name" value  = {items.quantity} readOnly/>
                                        <button onClick={()=>handleDereasedQuantity(items.id)}>

                                        </button>

                                    

                                    </div>
                                </div>

                    })}
                            <div className="total">Total:${totalPrice}</div>
                            <button className="checkout-btn" onClick={()=>setShowModal(true)}>
                                CheckOut
                            </button>
                            
                            </>
)}

              </div>
            <CheckOutPop
            show = {showModal}
            handleClose={()=>setShowModal(false)}
            cartItems = {cartItems}
            totalPrice={totalPrice}
            handleCheckout={handleCheckOut}/>
        </div>
    )

}
export default CART