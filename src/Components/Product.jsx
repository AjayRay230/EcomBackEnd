import{useNavigate, useParams} from "react-router-dom"
import { useEffect,useState,useContext } from "react"
import axios from "../axios"
import MyContext from "../Context/Context"
function Product(){
    const[product,setProduct] = useState(null)
    const{data,AddToCart,removeFromCart,cart,refreshData} = useContext(MyContext);
    const[imageUrl,setImageUrl] = useState("");
    
    const{id}  = useParams();
//      When to use navigate instead of <Link>?
// You need to redirect after a certain action (e.g., form submission).

// You need to navigate based on logic or conditions.

// You are inside a function and can’t use JSX.
    const navigate = useNavigate();
    
    useEffect( ()=>{
        const fectchProduct= async ()=>{
            try{
               // Makes an API request to get the product by its id.




            const response = await axios.get(`http://localhost:8080/api/product/${id}`);
 //Stores the product data in the state with setProduct.
            setProduct(response.data);
            if(response.data.imageName)
            {
                fetchImage();
            }
            }
            catch(error)
            {
                console.error("error while fetching product",error);
            }
        };
// Fetches the product image as a binary blob.

// Converts that blob into a temporary URL using URL.createObjectURL().

// Updates imageUrl state so you can show the image (e.g., in an <img> tag).
        const fetchImage = async()=>
    {
        const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, {responseType:"bolb"});
        setImageUrl(URL.createObjectURL(response.data));
    };
        fectchProduct();
    },[id]);// id here makes the component run only once every time the id changes or comp mounts

    

  // delete product  function 
   const deleteProduct = async()=>{
    try{
        await axios.delete(`/product/${id}`);
        removeFromCart(id);
        console.log("Product deleted successfully ");
        refreshData();
        navigate("/")
    }
    catch(error)
    {
        console.log("Error deleting product :" ,error);
    }
   };
//function to handle the AddToCart 
 const handleAddToCart = ()=>{
    AddToCart(product);
    alert("product has been added to the cart");
 }
 //inside the update component to edit the product details or somthing 
 const handleEditClick = ()=>{
    navigate(`/product/update/${id}`);
 }
    if(!product)
    {
        return (
            <div style={{alignItems:"center"}}>Loading.....</div>
        )
      

    }
    return(
        <div className="product-card">
        <img 
        className="column -img"
        src = {product.imageUrl}
        alt  = {product.imageName}
        />
            <div className="column">
                <div className="product-description">
                    <h2>{product.category}</h2>
                    <div>
                        <h6>
                            Listed: <span><i>
                                {new Date(product.releaseDate).toLocaleDateString()}
                            </i>
                            </span>
                        </h6>
                    </div>
                    <h2>{product.name}</h2>
                    <h5>{product.brand}</h5>
                    <p>{product.description}</p>
                </div>
                <div className="price">
                    <span>$ {product.price}</span>
                    <div className="add-to-cart-btn"></div>
                    <button
                     className={`cart-btn ${!product.available? "disable-btn" :" "}`}
                     onClick = {handleAddToCart}
                     disabled = {!product.available}
                    >
                        {product.available?"Add to Cart" :"Out of Stock"}

                    </button>
                    <h5 style={{color:"#1976d2",marginLeft:"5px" ,marginRight:"5px"}}>Stock Available  :{""}
                    <i style={{marginLeft:"10px",color:"#1976d2"}}>
                        {product.quantity}
                    </i>
                    </h5>
                    <div>
                        <h4> Product Listed on:</h4>
                        <i>{product.releaseDate}</i>
                    </div>
                </div>
                <div className="get-btn">
                    <button className="update-btn" onClick = {handleEditClick}>Update</button>
                    <button className="delete-btn" onClick={deleteProduct}>Delete</button>
                </div>
            </div>
                
        </div>
    )
}
export default Product;