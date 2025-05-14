import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../services/constants";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please log in to view your cart.");
                return;
            }

            try {
                const { data } = await axios.get(`${API_URL}/cart/${token}`, {
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                });

                console.log("Cart data:", data);

                setCartItems(data);
            } catch (error) {
                console.error("Error fetching cart data", error);
            }
        };
        fetchCart();

        console.log("Cart items:", cartItems);
    }, []);

    useEffect(() => {
        console.log("Cart items updated:", cartItems);

        console.log(cartItems.length);
    }, [cartItems]);

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`${API_URL}/cart/${productId}`, {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            setCartItems(cartItems.filter((item) => item._id !== productId));
        } catch (error) {
            console.error("Error removing item from cart", error);
        }
    };

    return (
        <div className="text-center p-4">
            <h1>Your Cart</h1>
            {!cartItems.length || cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="border p-4 rounded shadow"
                        >
                            <img src={item.image} alt={item.name} />
                            <p>{item.name}</p>
                            <p>${item.price}</p>
                            <button
                                className="py-2 px-6 rounded bg-red-600 text-white"
                                onClick={() => removeFromCart(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
