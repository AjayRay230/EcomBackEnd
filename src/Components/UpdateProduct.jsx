import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"
const updateProduct = ()=>{
    const{id}  = useParams();
    const[product,setProduct] = useState({});
    const[image,setImage] = useState();
    const[updateProduct,setUpdateProduct] = useState({
        id :null,
        name:"",
        description:"",
        brand:"",
        price:"",
        category:"",
        releaseDate:"",
        available:"",
        quantity:""
    });
    useEffect(()=>{
    const fetchProduct = async()=>
    {
        try{
            const response = await axios.get(`http://localhost:8080/api/product/${id}`);
            setProduct(response.data);
            const responseImage = await axios.get(`http://localhost:8080/api/product/${id}/image`,{responseType:"blob"});
           // Converts the image blob to a File object using a custom utility function.
            const imageFile  = await convertUrlToFile(responseImage.data,response.data.imageName);
            setImage(imageFile);
            setUpdateProduct(response.data);

        }
        catch(error)
        {
            console.error("error while fetching the product",error);
        }
    }
    fetchProduct();
}

   ,[id] );

//    useEffect(()=>
// {
//     console.log("image updated",image);
// },[image]);
const convertUrlToFile = async(blobData,fileName)=>{
    const file   = new File([blobData],fileName,{type:blobData.type});
    return file;
}
 const handleSubmit = async(e)=>{
    e.preventDefault();
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile",image);
    updatedProduct.append("product",
        new Blob([JSON.stringify(updateProduct)],{type:"application/json"})
    )
    axios.put(`http://localhost:8080/api/product/${id}`,updatedProduct,{
        headers:{
            "Content-Type":"multipart/form-data",
        }
    })
    .then((response)=>{
        console.log("product updated successfully",updatedProduct)
        alert("product updated successfully!");
    }).catch((error)=>
    {
        console.error("Error while updating product",error);
        alert("Failed to update product.Please try again");
    })
 };
 const handleChange = (e)=>{
    const{name,value,type,checked}= e.target;
    setUpdateProduct({
        ...updateProduct,[name]:type === "checkbox"?checked:value,
    });
 };
 const handleImageChange = (e)=>setImage(e.target.files[0]);
 
 return (
     <div className="master-container">
            <div className="container">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="name-div">
                        <label className="label-name">
                            <h6>Name</h6>
                        </label>
                        <input
                        className="name"
                        type = "text"
                        placeholder="product name"
                        onChange={handleChange}
                        value={updateProduct.name}
                        name = "name"/>
                    </div>
                    <div className="brand-div">
                        <label className="label-brand">
                            <h6>Brand</h6>
                        </label>
                        <input
                        type = "text"
                        placeholder="name of brand"
                        name = "brand"
                        onChange={handleChange}
                        value = {updateProduct.brand}
                        id = "brand"
                        />
                    </div>
                    <div className="description-div">
                        <label className="description-label">
                            <h6>Description</h6>

                        </label>
                        <input 
                        value = {updateProduct.description}
                        type = "text"
                        name = "description"
                        onChange={handleChange}
                        placeholder="Description of Product"
                        id = "description"
                        />
                    </div>
                    <div className="price-div">
                        <label className="price-label">
                            <h6>Price</h6>
                        </label>
                        <input type = "number"
                        value = {updateProduct.price}
                        name = "price"
                        onChange={handleChange}
                        placeholder="Eg:$1000"
                        id = "price"
                        />
                    </div>
                    <div className="category-div">
                        <label className="category-label">
                            <h6>Category</h6>

                        </label>
                        <select 
                        name = "category"
                         value = {updateProduct.category}
                         onChange={handleChange}
                         className="select"
                          id = "category"
                         >
                            <option value = "">Select Category</option>
                            <option value = "Laptop">Laptop</option>
                            <option value = "Cloths">Cloths</option>
                            <option value="Toys">Toys</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Headphones">Headphones</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Fashion">Fashion</option>
                         </select>
                    </div>
                    <div className="stock-div">
                        <label className="stock-label">
                            <h6>Stock Quantity</h6>

                        </label>
                        <input value = {updateProduct.quantity}
                        onChange={handleChange}
                        type = "number"
                        name = "quantity"
                        placeholder="Product Quantity"
                         id = "quantity"
                        />

                    </div>
                    <div className="release-div">
                        <label className="release-label">
                            <h6>Release Date</h6>
                        </label>
                        <input
                                type="date"
                                name="releaseDate"
                                value={updateProduct.releaseDate ? updateProduct.releaseDate : ""}  
                                onChange={(e) =>
                                    setUpdateProduct({
                                    ...updateProduct,
                                    releaseDate: e.target.value, 
                                    })
                                }
                                placeholder="yyyy-MM-dd"
                                />
                    </div>
                    <div className="image-div">
                        <label className="image-label">
                             <img
                                src={image ? URL.createObjectURL(image) : "Image unavailable"}
                                alt={updateProduct.imageName}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    padding: "5px",
                                    margin: "0",
                                }}
                                />
                        </label>
                        <input type = "file"
                        onChange={handleImageChange}
                         placeholder="upload image"
                         name = "imageUrl"
                         id = "imageUrl"
                        />
                    </div>
                    <div className="check-div">
                        <label className="availabel-label"> Product Available</label>
                        <input type = "checkbox"
                        className="checkbox"
                        name = "available"
                        checked = {updateProduct.available}
                        onChange={(e)=>{
                            setProduct({...updateProduct,available:e.target.checked})
                        }}
                        />
                        
                    </div>
                    <div className="submit-div">
                        <button className="submit-btn"
                        type="button"
                        
                        > Submit</button>
                    </div>
                </form>
            </div>
            </div>
 )


}
export default updateProduct;