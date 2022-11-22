// start express
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from './db/models/User.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const app = express();
const port = 3000;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

let DB = [];

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5252'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
  }),
);

app.post('/api/login', async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      const existsInDB = DB.find((person) => person?.email === profile?.email);

      if (!existsInDB) {
        console.log('registered new acc, ', profile);
        DB.push(profile);
      } else {
        console.log('already existed', profile);
      }

      console.log(DB);

      res.status(201).json({
        message: 'Login was successful',
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

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

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: 'Invalid user detected. Please try again' };
  }
}
