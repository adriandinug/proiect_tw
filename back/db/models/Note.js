import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class Note extends Model {}

Note.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    content: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
  },
);

export default Note;
