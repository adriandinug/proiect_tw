import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class NoteGroup extends Model {}

NoteGroup.init(
  {},
  {
    sequelize,
  },
);

export default NoteGroup;
