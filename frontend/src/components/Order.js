// src/components/Order.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Order = ({ cart, clearCart }) => {
    const navigate = useNavigate();

    // 计算总价 (Total Price Calculation)
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    // 处理下单逻辑
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            // 发送给后端 Order Service
            const response = await axios.post('http://127.0.0.1:5000/api/orders', {
                user_id: 1, // 简化版：暂时默认是 ID 为 1 的用户
                items: cart, // 把买的东西发过去
                total_price: totalPrice
            });

            // 成功后
            alert(`Order Placed Successfully! Order ID: ${response.data.order_id}`);
            clearCart(); // 清空购物车
            navigate('/'); // 回到首页
        } catch (error) {
            console.error("Order failed:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty. Go back to menu to add some smoothies!</p>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.map((item, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Total: ${totalPrice.toFixed(2)}
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                        Place Order
                    </button>
                </>
            )}
        </div>
    );
};

export default Order;