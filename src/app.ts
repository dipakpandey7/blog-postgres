// src/app.ts

import express, { Request, Response } from 'express';
import { connectDatabase } from './DataBase';
import authRoute from './routes/authRoute';
import {sequelize} from "./DataBase";
import emailRoutes from './routes/emailRoutes';
import postRoute from "./routes/postRoute";
import dotenv from 'dotenv';
import path from 'path';
import paymentRoutes from './routes/paymentRoute';





const app = express();
app.set('views', './views');
app.set('views', path.join(__dirname, '..', 'views'));
dotenv.config();

app.use(express.json());


// Call the function to authenticate the database connection
connectDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Use the user routes
app.use('/api/auth', authRoute);
app.use("/api/post" , postRoute);
app.use('/email', emailRoutes);

app.use('/api/payments', paymentRoutes);

sequelize.sync({force:false}).then(()=>{
  // console.log("Database or table created");
  return 
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
