import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

function Register() {
const navigate = useNavigate()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegs = async () => {

    const payload = { name:name, email:email, password:password };
    console.log("payload", payload)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/register`, payload,
       { headers: {
            'Content-Type': 'application/json',
          },},
      );
      message.success('Registeration Successfully')
   navigate('/login')
      console.log('register successful:', res.data);
    } catch (err) {
      console.error('register failed:', err);
      message.success('Registeration failed')

      setError('register failed. Please try again.');
    }
  };

  return (
    <div className='LoginForm'>
      <div className='formData text-align-center'>
        <h2 className='m-1 m-4'>Registeration Form</h2>
        {error && <Alert message={error} type="error" />}
        
        <Form
          name="Register"
          style={{ maxWidth: 600 }}
          layout="vertical"
          autoComplete="off"
          onFinish={handleRegs}
        >
          {/* Name Field */}
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { max: 50, message: 'Name cannot exceed 50 characters' },
            ]}
          >
            <Input
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

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
              { min: 6, message: 'Password must be at least 6 characters long' },
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
              Register
            </Button>
          </Form.Item>
        </Form>
       <Link to='/login'>
       <p>Or Sign in </p>
       </Link>
      </div>
    </div>
  );
}

export default Register;
