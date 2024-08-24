import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import axios from 'axios';
import Cookies from 'cookies-js'; 
import
{ message }
from
"antd"
;
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async () => {
    const payload = {  email, password };
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/login`, payload);
      Cookies.set('token', res.data.token);
      navigate('/')
     message.success('Login Successfully');
       
      console.log('Login successful:', res.data);
    } catch (err) {
      message.error('Login Failed')

      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className='LoginForm'>
      <div className='formData'>
        {error && <Alert message={error} type="error" />}
        
        <Form
          name="login"
          style={{ maxWidth: 600 }}
          layout="vertical"
          autoComplete="off"
          onFinish={handleLogin}
        >
       
          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
            ]}
          >
            <Input.Password
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        <Link to='/register'>
       <p>Or Sign Up </p>
       </Link>
      </div>
    </div>
  );
}

export default Login;
