const express = require('express')
require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const server = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')

const  { USerModel } =  require('./models/userSchema')
const  { TodoSchema, TodoModel } =  require('./models/TodoSchema')
server.use(express.json())
server.use(cors())

const Port = process.env.Port
const Secret_Key = process.env.Secret_key


mongoose.connect(process.env.mongo_uri)
.then(()=> {
    console.log('mongoose connected')
    
}).catch((err)=> {
    console.log('error mongoose running', err)

})




server.get('/', (req, res)=> {
    res.send('welcome')
})

// user Registeration 
server.post('/register', async (req,res)=> {
const {name, email, password} = req.body 

const isUserExist = await  USerModel.findOne({email})

if(isUserExist){
    res.status(400).json('user exist')
}else{
   bcrypt.hash(password, 5, async (err, hash)=> {
        if(err){
            console.log(err)
        }else{
            const newUser = new  USerModel({
                name: name,
                email:email,
                password: hash
            })

            await newUser.save()
          

            res.send({
                data:newUser,
                messgae:"successfull"
            })
         }
    })
}

})


server.post('/login', async (req,res)=> {
    const {email, password} = req.body 
    
    const users = await  USerModel.findOne({email})
    
    if(!users){
        res.status(400).json('user not exist')
    }else{
      bcrypt.compare(password, users.password, async (err, result)=> {
            if(err){
                console.log(err)
            }if(result){

     const token =   jwt.sign({
        name: users.name,
        email:users.email,

        _id : users._id
       }, Secret_Key)

                const newUser = new  USerModel({
                    name: users.name,
                    email:users.email,
                })              
    
                res.json({
                    token :token,
                    data:newUser,
                    messgae:"successfull"
                })
             }
        })
    }
    
    })




    server.post('/todo', async (req, res) => {
        const { TodoDesc, Date,Completed, user_id } = req.body;
    
        if (!user_id) {
            return res.status(400).json({ message: "TodoName and user_id are required" });
        }
    
        try {
            const newTodo = new TodoModel({
              
                TodoDesc,
                Completed,
                Date,
                user_id
            });
    
            await newTodo.save();
            res.status(201).json({
                data: newTodo,
                message: "Todo created successfully"
            });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });


    server.get('/todo/:userId', async (req, res) => {
        const { userId } = req.params;
    
        try {
            const todos = await TodoModel.find({ user_id: userId });
            res.json({
                data: todos,
                message: "Todos retrieved successfully"
            });
        } catch (err) {
            console.log('Error:', err);
            res.status(500).json("Internal Server Error");
        }
    });



//  update Todo
    server.put('/todo/:id', async (req, res) => {
        const { id } = req.params;
        const {  TodoDesc, Completed, Date,  } = req.body;
    
        try {
            const updatedTodo = await TodoModel.findByIdAndUpdate(id, {
               
                TodoDesc,
                Completed,
                Date
            }, { new: true });
    
            if (!updatedTodo) {
                return res.status(404).json('Todo not found');
            }
    
            res.json({
                data: updatedTodo,
                message: "Todo updated successfully"
            });
        } catch (err) {
            console.log('Error:', err);
            res.status(500).json("Internal Server Error");
        }
    });



//  delete Todo 

server.delete('/todo/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json('Todo not found');
        }

        res.json({
            data: deletedTodo,
            message: "Todo deleted successfully"
        });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json("Internal Server Error");
    }
});




server.listen(Port, () => {
    console.log('server running', Port)
})