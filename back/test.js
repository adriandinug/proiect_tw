import User from './db/models/User.js';
import Note from './db/models/Note.js';
import { Blob } from 'buffer';

(async () => {
  const users = await User.findAll({ raw: true });
  const notes = await Note.findAll({ raw: true });
  // const adi = await User.findOne({
  //   where: { mail: 'dinuadrian20@stud.ase.ro' },
  //   include: Note,
  // });
  console.log(users);
  console.log(notes);
  // console.log(adi);
})();
