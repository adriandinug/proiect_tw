import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class Friend extends Model {}

Friend.init(
  {
    friendId: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
  },
);

export default Friend;
