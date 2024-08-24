import React, { useState, useEffect } from 'react';
import { message, Modal, Form, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Cookies from 'cookies-js'; 
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';

function Home() {
  const token = Cookies.get('token');
  const DecodeToken = token && jwtDecode(token)
  const user_id = DecodeToken && DecodeToken._id
    console.log("DecodeToken", user_id)
 const navigate = useNavigate()


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTodo, setCurrentTodo] = useState(null);
    const [form] = Form.useForm(); 

    const showEditModal = (todo) => {
      setCurrentTodo(todo);
      form.setFieldsValue({
        TodoDesc: todo.TodoDesc
      });
      setIsModalVisible(true);
    };

    const handleOk = async () => {
      try {
        const values = await form.validateFields();
        const payload = {
          TodoDesc: values.TodoDesc,
          Completed: currentTodo.Completed
        };
        await axios.put(`${import.meta.env.VITE_BACKEND_API}/todo/${currentTodo._id}`, payload);
        message.success('Todo updated successfully');
        getTodo();
        setIsModalVisible(false);
      } catch (error) {
        message.error('Failed to update todo');
        console.error('Error updating todo:', error);
      }
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
    };



  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState('');
 const [ isCompleted, setIscompleted] = useState('false')

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (value.trim()) {
      const payload = {
        TodoDesc: value,
        Completed : false,
        Date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        user_id 
      };
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/todo`, payload);
        message.success('Todo created successfully');
        console.log('res get', res)
        // setTodos(res.data.data)
        getTodo()
        // setTodos([...todos, { text: value, completed: false }]);
        setValue('');
      } catch (err) {
        message.error('Failed to create todo');
        console.error('Error creating todo:', err);
      }
    }
  };

  const getTodo = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/todo/${user_id}`); 
      setTodos(res.data.data);
      console.log('Todos fetched successfully:', res.data);
    } catch (err) {
      message.error('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    }
  };


//  update status to be completed 
  const handleToggleTodo = async(TodoId, todo) => {
    console.log("updatedTodo",todo)
   console.log("complete", todo.Completed)
  const payload = {
    Completed : !todo.Completed
  }
   try{
    const res = await axios.put(`${import.meta.env.VITE_BACKEND_API}/todo/${TodoId}`, payload); 
    getTodo()
 console.log("update response", res)
   }catch(err){
    console.log(err)
   }

  };


 // Delete Todo
  const handleRemoveTodo = async (todoId) => {
    try {
      // const todoToRemove = todos[index];
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/todo/${todoId}`); 
      getTodo()
      message.success('Todo removed successfully');
    } catch (err) {
      message.error('Failed to remove todo');
      console.error('Error removing todo:', err);
    }
  };

  const handleLogout = () => {
    Cookies.expire('token'); 
    navigate('/login'); 
    message.warning('logout')
  };

  useEffect(() => {
    getTodo(); 
  }, []);

  return (
    <div className="container mt-5">
       <button
          className="btn btn-outline-danger"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      <header className="mb-4 text-center">
        <h1>Create Your Todo</h1>
      </header>
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={handleAddTodo} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Add a new task"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ul className="list-group">
            {todos.length >= 0 && todos?.map((todo, index) => (
              
              <li
                key={todo._id || index}
                className={`list-group-item d-flex justify-content-between align-items-center ${todo.completed ? 'list-group-item-success' : ''}`}
              >
                <span style={{ textDecoration: todo.Completed ? 'line-through' : 'none' }}>
                  {todo.TodoDesc}
                </span>
                <div>
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => handleToggleTodo(todo._id, todo)}
                  >
                    {todo.Completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => showEditModal(todo)}
                  >
                   Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Modal
      title="Edit Todo"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout="vertical"
        name="editTodo"
      >
        <Form.Item
          name="TodoDesc"
          label="Todo Description"
          rules={[{ required: true, message: 'Please input the todo description!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
      </div>
    </div>
  );
}

export default Home;
