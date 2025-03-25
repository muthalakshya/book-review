import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import  connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/useRoute.js'
import bookRouter from './routes/bookRoute.js';

const app = express();
const port = process.env.PORT || 5000;
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/user',userRouter)
app.use('/books',bookRouter)


app.get('/', (req,res)=>{
    res.send("API Work")
})

app.listen(port, ()=> console.log("Server Start"))