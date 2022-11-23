import User from './db/models/User.js';

(async () => {
  await User.sync({ force: true });
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
  const users = await User.findAll({ raw: true });
  console.log(users);
})();
