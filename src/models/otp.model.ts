// models/otp.model.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../DataBase';
import { User } from './user.model'; 

export const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Establish relationship
User.hasOne(OTP);
OTP.belongsTo(User);

export default OTP;