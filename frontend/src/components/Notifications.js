// src/components/Notifications.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [msgs, setMsgs] = useState([]);
    const userId = 1; // 同样，演示时我们固定为用户 1

    useEffect(() => {
        // 每 2 秒自动刷新一次，模拟“实时”通知 (Polling)
        // 这样你刚下完单，不用刷新页面，通知就会跳出来
        const fetchNotifications = () => {
            axios.get(`http://127.0.0.1:5000/api/notifications/${userId}`)
                .then(res => setMsgs(res.data))
                .catch(err => console.log(err));
        };

        fetchNotifications(); // 一进来先查一次
        const interval = setInterval(fetchNotifications, 2000); // 然后每2秒查一次

        return () => clearInterval(interval); // 离开页面时停止刷新
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>🔔 Notifications</h2>
            {msgs.length === 0 ? (
                <p>No new notifications.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {msgs.map(msg => (
                        <li key={msg.id} style={{
                            background: '#e3f2fd',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            borderLeft: '5px solid #2196f3'
                        }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>System Message</div>
                            <div>{msg.message}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>{msg.timestamp}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;