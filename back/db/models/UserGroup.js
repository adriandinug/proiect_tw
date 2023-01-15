import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class UserGroup extends Model {}

UserGroup.init(
  {},
  {
    sequelize,
  },
);

export default UserGroup;
