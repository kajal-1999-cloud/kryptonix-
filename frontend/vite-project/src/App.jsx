import { useState } from 'react'
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/home'
import Login from './Components/login'
import Register from './Components/Register'
import './App.css'
import Cookies from 'cookies-js'; 
import  {jwtDecode}  from 'jwt-decode';
function App() {

  const token = Cookies.get('token');
  const DecodeToken = token && jwtDecode(token)
  const user_id = DecodeToken && DecodeToken._id
    console.log("DecodeToken", user_id)
 const navigate = useNavigate()

  return (
    <>
  
      <Routes>
          <Route path='/' element={token ?(<Home/>) : (<Login/>)}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
      </Routes>
    
    </>
  )
}

export default App
