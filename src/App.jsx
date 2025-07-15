import { useContext, useState } from 'react'

import './App.css'
import NavBar from "./Components/NavBar.jsx";
import AddProduct   from "./Components/AddProduct.jsx";
import CART from "./Components/Cart.jsx"
import Product from "./Components/Product.jsx"
import {AppContextProvider} from "./Context/Context"
import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx"
import UpdateProduct from './Components/UpdateProduct.jsx';
function App() {
  const [cart,setCart] = useState([])
  const[selectedCategory,setSelectedCategory] = useState("")
  //for the debugging and selecting the category of the item;
const handleSelectedCategory=(category)=>{
  setSelectedCategory(category);
  console.log("category:",category)
}
const AddtoCart=(product)=>{
   const currentIndex = cart.find((item)=>item.id===product.id)
   if(currentIndex)
   {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
   }
   else
   {
      setCart([...cart,{...product,quantity:1}])
   }

}

  return (
    <AppContextProvider>
  <BrowserRouter>
       <NavBar onSelectedCategory = {handleSelectedCategory} />
       <Routes>
        <Route path = "/"
        element = {
          <Home AddToCart = {AddtoCart} selectedCategory = {selectedCategory}/>
        }
       />
        <Route path = "/add_product" element= {<AddProduct/>}/>
        <Route path="/product" element={<Product  />} />
        <Route path="product/:id" element={<Product  />} />
        <Route path = "/Cart" element = {<CART/>}/>
         <Route path="/product/update/:id" element={<UpdateProduct />} />
        </Routes>
       
       
       </BrowserRouter>
       </AppContextProvider>
      
  )
}

export default App
