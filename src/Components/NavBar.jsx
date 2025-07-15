import {useState,useEffect} from "react";
import axios from "axios";
import {FaSearch, FaShoppingCart,FaMoon,FaSun} from 'react-icons/fa'
import { MdOutlineSettingsApplications } from "react-icons/md";
function NavBar({onSelectedCategory,onSearch}){
    const getInitialTheme = ()=>
        {
            const storedTheme = localStorage.getItem("theme");
            return storedTheme?storedTheme:"light";
        }
        const[selectedCategory,setSelectedCategory] = useState("");
        const[input,setInput] = useState("");

        const[theme,setTheme] = useState(getInitialTheme);
        const[searchResults,setSearchResults] = useState([]);
        const[noResults,setNoResults] = useState(false);
        const[showSearchResults,setShowSearchResults] = useState(false);
      
      //fetch data from api when the page loads
      // set up event listeners
      //load initial valuses into state;
      // can skip if data is already availble or not needed
        useEffect(()=>
    {
   fetchData();
    },[])  ;
    const fetchData = async(value)=>{
        try{
            const response = await axios.get(`http://localhost:8080/api/product`);
            setSearchResults(response.data);
            
        }
        catch(error)
        {
            console.error("Error fetching data :" ,error);
        }
    };
    const handleChange = async (value)=>{
            setInput(value);
            if(value.length>=1)
            {
                setShowSearchResults(true);
            
            try{
                const response = await axios.get(`http://localhost:8080/api/product/search?keyword=${value}`);
                setSearchResults(response.data);
                setNoResults(response.data.length===0);

            }
            catch(error)
            {
                console.error("Error searching :" ,error);
            }
        }
            else
            {
                setShowSearchResults(false);
                setSearchResults([]);
                setNoResults(false);
            }
    };
    const handleCategorySelect = (category)=>{
        setSelectedCategory(category);
        onSelectedCategory(category);
    }
    
    const cateogries = [
        'Laptop',
        "Headphones","Mobile","Electronics",
        "Toys",
        "Fashion"
    ];
        
    const toggleTheme = ()=>{
       const newTheme = theme ==='light'?'dark':'light';
       setTheme(newTheme);
       localStorage.setItem("theme",newTheme);
    };
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return(

       <nav className='nav'>
           <header className='header'>
          <div className='navbar'>
              <a className='logo' href  = "https://github.com/">Ajay Roy</a>
              <a href = "/">Home</a>
              <a href="/add_product">Add Product</a>
              <div className="dropdown">
              <button className="dropbtn">Categories
                  <span style={{ fontSize: '0.7rem' , marginLeft:'10px' }}> ▼ </span></button>
                  <div className="dropdown-content">
                    {cateogries.map((category)=>
                    <li key = {category}>
                        <button onClick={()=>handleCategorySelect(category)}>{category}</button>
                    </li>
                    
                    )}
                      
                  </div>

              </div>

               <button onClick={toggleTheme}>{
                   theme ==='light'?<FaSun/>:<FaMoon/>
               }</button>
               <a href="/Cart" className="cart" >
                   <FaShoppingCart/> Cart
               </a>
               
               <div className="search-container">
                   <FaSearch className="search-icons"/>
                   <input type = "search" placeholder="Search"
                          className="search-box"
                          value = {input}
                          onChange={(e)=>handleChange(e.target.value)}
                          onFocus={()=>setSearchResults(true)}
                          onBlur={()=>setSearchResults(false)}
                   />
                   {showSearchResults && (

                    <ul className="list-group">
                        {searchResults.length>0?(
                            searchResults.map((result)=>(
                                <li key = {result.id} className="list-group-item">
                                    <a href = {`/product/${result.id}`} className="search-result-link">
                                    <span> {result.name}</span>
                                    </a>
                                </li>
                            ))
                        ):(
                            noResults && (<p className="no-results-msg">
                                No product with such name
                            </p>
                        )
                    )}
                    </ul>
                   )}
               </div>

           </div>
           </header>
       </nav>

    )
}
export default NavBar