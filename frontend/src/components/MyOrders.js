// src/components/MyOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    // 简化版：假设当前登录的是 ID 为 1 的用户
    // (如果你做了完整的登录逻辑，这里应该从 localStorage 或 Context 里拿 user_id)
    const userId = 1;

    useEffect(() => {
        // 找后端要数据
        axios.get(`http://127.0.0.1:5000/api/orders/user/${userId}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
            });
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>My Order History</h2>
            {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Order ID</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Status</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Total Price</th>
                            {/* <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Date</th> (数据库如果没存时间可不显示) */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>#{order.id}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        background: order.status === 'Completed' ? '#d4edda' : '#fff3cd',
                                        color: order.status === 'Completed' ? '#155724' : '#856404'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                                    ${order.total_price}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyOrders;