// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';//路由工具
import Menu from './components/Menu';
import Login from './components/Login';
import Order from './components/Order';
import MyOrders from './components/MyOrders'; // 1. 引入新组件
import Notifications from './components/Notifications'; // 1. 引入

function App() {
  const [cart, setCart] = useState([]);

//put new things into cart array
  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

// after successful order clean the shopping cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '15px', background: '#282c34', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🥤 Smoothie System</div>
          <div>
            <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Menu</Link>
            <Link to="/order" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Cart ({cart.length})</Link>
            <Link to="/my-orders" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Orders</Link>

            {/* 2. 新增 Notifications 链接 */}
            <Link to="/notifications" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>🔔</Link>

            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Menu addToCart={addToCart} />} />
          <Route path="/order" element={<Order cart={cart} clearCart={clearCart} />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* 3. 新增路由 */}
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;