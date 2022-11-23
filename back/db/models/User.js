import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class User extends Model {
  getName() {
    return [this.nume, this.prenume].join(' ');
  }

  getId() {
    return this.id;
  }

  showAll() {
    return [this.nume, this.prenume, this.mail].join(', ');
  }
}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
  },
);

export default User;
