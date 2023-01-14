import User from './db/models/User.js';
import Note from './db/models/Note.js';
import { sequelize } from './db/connection.js';

(async () => {
  User.hasMany(Note, { foreignKey: 'noteOwner', targetKey: 'id', type: 'UUID' });
  Note.belongsTo(User, { foreignKey: 'noteOwner', targetKey: 'id', type: 'UUID' });
  await User.sync({ force: true });
  await Note.sync({ force: true });
  // const queryInterface = sequelize.getQueryInterface();
  // queryInterface.addConstraint('Notes', {
  //   fields: ['type'],
  //   type: 'check',
  //   name: 'NOTES_CH_TYPE',
  //   where: {
  //     type: ['CURS', 'SEMINAR'],
  //   },
  // });

  // const users = await User.findAll({ raw: true });
  // const notes = await Note.findAll({ raw: true });
  // console.log(users);
  // console.log(notes);
})();
