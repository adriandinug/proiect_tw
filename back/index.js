// start express
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from './db/models/User.js';
import Note from './db/models/Note.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const port = 3000;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

      const existsInDB = await User.findOne({ where: { mail: profile.email } });

      if (!existsInDB && profile?.email.includes('ase.ro')) {
        await User.sync();
        const user = await User.create({
          nume: profile?.family_name,
          prenume: profile?.given_name,
          mail: profile?.email,
          picture: profile?.picture,
        });
      }

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

app.post('/api/verify', async (req, res) => {
  try {
    const token = req.body.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    const existsInDB = await User.findOne({ where: { mail: req.body.mail } });
    if (existsInDB) {
      res.status(200).json({
        message: 'Token is valid',
        valid: true,
      });
    } else {
      res.status(200).json({
        message: 'Account not found',
        valid: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
      valid: false,
    });
  }
});

app.post('/api/user/save', async (req, res) => {
  try {
    const note = req.body.note;
    const email = req.body.email;
    const user = await User.findOne({ where: { mail: email } });
    if (user) {
      await Note.sync();
      const noteToSave = await Note.create({
        content: note,
        userId: user.id,
      });
      res.status(201).json({
        message: 'Note saved',
        saved: true,
        noteId: noteToSave.id,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      saved: false,
      note: null,
    });
  }
});

app.get('/api/user/notes/', async (req, res) => {
  const mail = req.get('user-email');
  const user = await User.findOne({ where: { mail: mail } });
  if (user) {
    let notes = await Note.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
    });
    if (notes) {
      notes.forEach((note) => {
        const notesText = note.content.toString();
        note.content = notesText;
      });
      res.status(200).json({
        message: 'Notes fetched',
        notes: notes,
      });
    }
  }
});

app.get('/api/user/notes/:id', async (req, res) => {
  const mail = req.get('user-email');
  const user = await User.findOne({ where: { mail: mail } });
  if (user) {
    const note = await Note.findOne({
      where: { id: req.params.id },
    });
    if (note) {
      console.log(note);
      const notesText = note.content.toString();
      note.content = notesText;
      res.status(200).json({
        message: 'Note fetched',
        note: note,
      });
    }
  }
});

app.post('/api/user/last', async (req, res) => {
  const mail = req.body.mail;
  const user = await User.findOne({ where: { mail: mail } });
  if (user) {
    const note = await Note.findOne({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
    });
    if (note) {
      const noteText = note.content.toString();
      res.status(200).json({
        note: note,
        noteText: noteText,
      });
    } else {
      res.status(200).json({
        message: 'No notes found',
        note: null,
      });
    }
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
