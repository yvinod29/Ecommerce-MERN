import express  from "express";
import colors from "colors" 
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import cors from 'cors';
import categoryRoute from './routes/CategoryRoute.js'
import productroute from './routes/ProductRoute.js'
dotenv.config();
const app =express()
connectDB();


app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/product",productroute)


app.get('/',(req,res)=>{
    res.send(
    "<h1>welocme to ecommer</h1>"  
    )
})

const PORT=process.env.PORT  || 8080;
app.listen(PORT, ()=>{
    console.log(`server Running on ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white);
})



