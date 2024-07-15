// src/app.ts

import express, { Request, Response } from 'express';
import { connectDatabase } from './DataBase';
import userRoute from './routes/authRoute';

const app = express();

app.use(express.json());

// Call the function to authenticate the database connection
connectDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Use the user routes
app.use('/api/auth', userRoute);
// app.use('/api/blogs', blogRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
