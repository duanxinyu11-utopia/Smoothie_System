// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');// 记住用户输入的邮箱
    const [password, setPassword] = useState('');// 记住用户输入的密码
    const [isRegistering, setIsRegistering] = useState(false); // 控制是显示“登录”还是“注册”
    const navigate = useNavigate(); // 用来跳转页面

    const handleSubmit = async (e) => {
        e.preventDefault();

// 如果 isRegistering 是 true，就去 '/register'；否则去 '/login'
        // 判断是调用登录接口 还是 注册接口
        const endpoint = isRegistering
            ? 'http://127.0.0.1:5000/api/users/register'
            : 'http://127.0.0.1:5000/api/users/login';

        try {
            const response = await axios.post(endpoint, {
                email: email,
                password: password
            });

            // 3. 成功后的处理
            alert(response.data.message);

            if (!isRegistering) {
                // 如果是登录成功，跳转回菜单页
                navigate('/');
            } else {
                // 如果注册成功，切换回登录模式
                setIsRegistering(false);
            }
        } catch (error) {
        // 4. 失败处理：比如密码错了，或者邮箱已被注册
            alert(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isRegistering ? 'Sign Up' : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                <span
                    onClick={() => setIsRegistering(!isRegistering)}
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isRegistering ? 'Login here' : 'Register here'}
                </span>
            </p>
        </div>
    );
};

export default Login;