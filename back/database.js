import User from './db/models/User.js';
import Note from './db/models/Note.js';

(async () => {
  await User.sync();
  await Note.sync({ force: true });
  User.hasMany(Note, { foreignKey: 'userId' });
  // const user = await User.create({
  //   nume: 'Adi',
  //   prenume: 'Dinu',
  //   mail: 'adriandinu3@yahoo.com',
  // });
  // const user2 = await User.create({
  //   nume: 'Gigi',
  //   prenume: 'Ion',
  //   mail: 'gigi@test.com',
  // });

  const test = 'asdsadasdasdasdas';
  const test2 = '1232132121312';
  const me = await User.findOne({ where: { mail: 'dinuadrian20@stud.ase.ro' } });
  const note = await Note.create({
    content: test,
    userId: me.id,
  });
  const note2 = await Note.create({
    content: test2,
    userId: me.id,
  });

  const users = await User.findAll({ raw: true });
  const notes = await Note.findAll({ raw: true });
  const adi = await User.findOne({
    where: { mail: 'dinuadrian20@stud.ase.ro' },
    include: Note,
  });
  console.log(users);
  console.log(notes);
  console.log(adi);
})();
