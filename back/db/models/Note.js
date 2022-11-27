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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New note',
    },
    content: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    materie: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Universal',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'SEMINAR',
      validate: {
        isIn: [['CURS', 'SEMINAR']],
      },
    },
  },
  {
    sequelize,
  },
);

export default Note;