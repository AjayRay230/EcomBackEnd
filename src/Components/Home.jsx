import { useContext,useEffect,useState } from "react";
import axios from "axios"
import MyContext from "../Context/Context"
import {Link} from "react-router-dom"
import unplugged from "../assets/unplugged.png"
const Home = ({selectedCategory}) =>
{
    const {data, isError, refreshData,AddToCart} = useContext(MyContext);
    const[isDataFetched,setIsDataFetched] = useState(false);
    const[products,setProducts] = useState([])
     useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);
//It fetches images for each product in the data array and adds the image URL to each product.
//  Then it updates the products state with the new data (product info + image).
     useEffect(() => {
      //When data is available and has products (data.length > 0), it runs the code.
    if (data && data.length > 0) {
//  For each product, it tries to:

// Get its image from the backend (/product/{id}/image) as a blob.

// Convert that blob into a usable URL.

// Attach that image URL to the product.
      const fetchImageAndUpdateProducts = async () => {
        const updatedPoducts = await Promise.all(data.map(async (product )=>{
          try{
            const response = await axios.get(`http://localhost:8080/api/product/${product.id}/image`,{responseType:"blob"});
            const imageUrl = URL.createObjectURL(response.data);
            return {...product ,imageUrl};
          }
          catch(error){
            console.log("Error while fetching the image  for product ID :",product.id,error );
            return {...product,imageUrl:"placeholder-image-url"};
          }
        }))
        //After all images are fetched, it updates the products state with
        //  the updated product list (each now has an imageUrl).
        setProducts(updatedPoducts);
      };
      fetchImageAndUpdateProducts();
    }
  }, [data]);
//   If a category is selected (selectedCategory is not null or empty):

// It returns only those products whose category matches selectedCategory.

// If no category is selected:

// It returns all products.


 const filteredProducts  = selectedCategory?products.filter((product)=>
   product.category === selectedCategory):products;

  if (isError) {
    
     return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
      <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
      </h2>
    );
    
  }
    return (
        <>
        <div className="grid">
            {products.map((product)=>
            <div
             className="card"
             key = {product.id}
             style={{}}
            
            
            >
              {filteredProducts.length === 0 ?
              (
                <h2>No Products Available</h2>
              ):(
                filteredProducts.map((products)=>{
                  const{id,brand,name,price,available,imageUrl} = 
                  product;
                  
                })
              )}
                <Link
                
                to={`/product/${product.id}`}
                style = {{}}
                
                >
                  <div
                    
                     className=" card-body"
                     style={{}}
                    
                    >
                  <img
                  src = {product.imageUrl}
                  alt = {product.name}
                  style={{
                      width: "100%",
                      height: "150px", 
                      objectFit: "cover",  
                      padding: "5px",
                      margin: "0",
                      borderRadius: "10px 10px 10px 10px", 
                    }}
                  />
                    
                        <div>
                            <h5  className=" card-name">{product.name.toUpperCase()}</h5>
                            
                                <span className=" card-brand"> By : 
                                    <i className="brand-tag">{product.brand}</i>
                                </span>
                           
                        </div>
                        <div>
                            <h5 className="card-text">
                                {"$"+ product.price}
                            </h5>
                            <button
                            className="btn btn-primery"
                            onClick={
                                (e)=>{
                                    e.preventDefault();
                                    AddToCart(product);
                                }
                            }
                            disabled = {!product.available}
                            >


                               {product.available?"Add to cart":"Out of Stock"}
                            </button>
                        </div>

                    </div>
                
                
                </Link>
                </div>

            
            )}
        </div>
        </>
    )

}
export default Home