import {FaTimes} from "react-icons/fa"
const CheckOutPop = ({show,handleClose,cartItems,totalPrice,handleCheckout})=>
{
    if(!show) return null;
    return (

        <div>
            <div>
                <h2> Checkout</h2>
                <button onClick={handleClose}>{FaTimes}</button>

            </div>
            <div>
                {cartItems.map((item)=>
                {
                    <div key = {item.id}>
                        <img src = {item.imageUrl} alt = {image.name}/>
                        <div>
                            <strong>{item.name}</strong>
                            <p>Quantity:{item.quantity}</p>
                            <p>Price:${item.price*item.quantity}</p>

                        </div>
                    </div>
                }

                )}
                <h4> Total :${totalPrice}</h4>

            </div>
                <div>
                    <button onClick={handleClose}>Close</button>
                    <button onClick={handleCheckout}>Confirm Purchase</button>
                </div>
        </div>
    )
}
export default CheckOutPop;