import User from './db/models/User.js';
import Note from './db/models/Note.js';
import { sequelize } from './db/connection.js';

(async () => {
  // await User.sync({});
  // await Note.sync({ alter: true });
  // User.hasMany(Note, { foreignKey: 'userId' });
  // const queryInterface = sequelize.getQueryInterface();
  // queryInterface.addConstraint('Notes', {
  //   fields: ['type'],
  //   type: 'check',
  //   name: 'NOTES_CH_TYPE',
  //   where: {
  //     type: ['CURS', 'SEMINAR'],
  //   },
  // });

  const users = await User.findAll({ raw: true });
  const notes = await Note.findAll({ raw: true });
  console.log(users);
  console.log(notes);
})();
