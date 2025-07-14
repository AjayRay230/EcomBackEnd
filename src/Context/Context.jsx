import {useState,useContext,createContext, useDebugValue,useEffect} from 'react'
import axios from "../axios"
const MyContext = createContext(
  { data: [],
  isError: "",
  cart: [],
  AddToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {} 
});
 export const AppContextProvider = ({children})=>{
    const[data,setData]  = useState([])//hold the product data from the api
    const[isError,setIsError] = useState("")//hold any error msg from the backend
    const[cart,setCart]= useState(JSON.parse(localStorage.getItem('cart'))|[])
    //if cart exist initializes it with localstorage value else start with an empty array
    const AddToCart=(product)=>{
            const getCurrentItemIndex = cart.findIndex((item)=>item.id===product.id)
            if(getCurrentItemIndex!==-1)
            {
                const updateCart = cart.map((item,index)=>{

                    index === getCurrentItemIndex ?{...item,quantity:item.quantity+1}:item;
                }) 
                setCart(updateCart);
                localStorage.setItem('cart',JSON.stringify(updateCart))
            }
            else{
                 const updateCart = [...cart,{...product,quantity:1}];
                 setCart(updateCart);
                 localStorage.setItem('cart',JSON.stringify(updateCart));
            }
    }
    const refreshData = async()=>{
        try{
            const getResponse = await axios.get("/product");
            setData(getResponse.data);
        }
        catch(error)
        {
            setIsError(error.message)
        }
    }
     useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
    const removeFromCart = (productID)=>
    {
        const updatedCart = cart.filter((item)=>item.id!==productID)
        setCart(updatedCart);
        localStorage.setItem('cart',JSON.stringify(updatedCart))
    }
    return (
        <MyContext.Provider value  = {{data,isError,cart,AddToCart,removeFromCart,refreshData}}>
            {children}
        </MyContext.Provider>
    )
}
export default MyContext;