// src/components/Menu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 接收 App.js 传过来的 addToCart 函数
const Menu = ({ addToCart }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/menu')
            .then(response => setMenuItems(response.data))
            .catch(error => console.error("Error fetching menu:", error));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Smoothie Menu</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {menuItems.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '220px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '5px' }} />
                        <h3>{item.name}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#28a745' }}>${item.price}</p>

                        {/* 点击按钮时，把当前这个 item 传给 addToCart */}
                        <button
                            onClick={() => addToCart(item)}
                            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Add to Order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;