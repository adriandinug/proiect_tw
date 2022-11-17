// start express
import express from 'express';
import User from './db/models/User.js';
const app = express();
const port = 3000;

// make route
app.get('/users', (req, res) => {
  (async () => {
    const users = await User.findAll({ raw: true });
    console.log(users);
    let resp = '';
    users.forEach((user) => {
      resp += '<p>' + user.nume + ' ' + user.prenume + ' ' + user.mail + '</p>';
    });
    res.send('<p>' + resp + '</p>');
  })();
});

// start server
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
