import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class Group extends Model {}

Group.init(
  {
    groupId: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    groupOwner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New group',
    },
  },
  {
    sequelize,
  },
);

export default Group;
