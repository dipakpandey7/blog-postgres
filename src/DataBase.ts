import { Sequelize } from "sequelize";


// Create a new instance of Sequelize
export const sequelize = new Sequelize('blog', 'postgres', 'Rajesh@875843', {
  host: 'localhost',
  dialect: 'postgres' 
});

// Authenticate the connection
 export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};




