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

      let respCode = 200;

      if (!existsInDB && profile?.email.includes('ase.ro')) {
        await User.sync();
        const user = await User.create({
          nume: profile?.family_name,
          prenume: profile?.given_name,
          mail: profile?.email,
          picture: profile?.picture,
        });
        respCode = 201;
      }

      const userId = await User.findOne({ where: { mail: profile.email } });

      res.status(respCode).json({
        message: 'Login was successful',
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ id: userId.id }, process.env.JWT_SECRET, {
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
      res.status(404).json({
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

// get last note
app.get('/api/user/last', async (req, res) => {
  const mail = req.get('user-email');
  const token = await decodeJWT(req.get('user-token'));
  const user = await User.findOne({ where: { mail: mail } });
  if (user && token.id == user.id) {
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
      res.status(404).json({
        message: 'No notes found',
        note: null,
      });
    }
  }
});

// get user
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = await decodeJWT(req.params.id);
    const user = await User.findOne({ where: { id: userId.id } });
    if (user) {
      res.status(200).json({
        message: 'User found',
        user: Object.assign({}, user.dataValues, { id: undefined }),
      });
    } else {
      res.status(404).json({
        message: 'User not found',
        user: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

// delete user
app.delete('/api/user/:id', async (req, res) => {
  try {
    const userId = await decodeJWT(req.params.id);
    const user = await User.findOne({ where: { id: userId.id } });
    if (user) {
      await user.destroy();
      res.status(200).json({
        message: 'User deleted',
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

// save one note
app.post('/api/user/note/', async (req, res) => {
  try {
    const note = req.body.note;
    const email = req.body.email;
    const token = await decodeJWT(req.body.token);
    const user = await User.findOne({ where: { mail: email } });
    if (user && token.id == user.id) {
      await Note.sync();
      const noteToSave = await Note.create({
        content: note,
        userId: user.id,
      });
      res.status(201).json({
        message: 'Note saved',
        saved: true,
        note: noteToSave,
      });
    } else {
      res.status(404).json({
        message: 'User not found',
        saved: false,
        note: null,
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

// get all user notes
app.get('/api/user/notes/:id', async (req, res) => {
  try {
    const userId = await decodeJWT(req.params.id);
    const user = await User.findOne({ where: { id: userId.id } });
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      notes: null,
    });
  }
});

// get one note
app.get('/api/user/note/:id', async (req, res) => {
  try {
    const userId = await decodeJWT(req.get('User-Token'));
    const user = await User.findOne({ where: { id: userId.id } });
    if (user) {
      const note = await Note.findOne({
        where: { id: req.params.id },
      });
      if (note) {
        const notesText = note.content.toString();
        note.content = notesText;
        res.status(200).json({
          message: 'Note fetched',
          note: note,
          found: true,
        });
      } else {
        res.status(404).json({
          message: 'Note not found',
          note: null,
          found: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      note: null,
    });
  }
});

app.put('/api/user/note/:id', async (req, res) => {
  try {
    const userId = await decodeJWT(req.get('User-Token'));
    const user = await User.findOne({ where: { id: userId.id } });
    if (user) {
      const note = await Note.findOne({
        where: { id: req.params.id },
      });
      if (note) {
        await note.update({ content: req.body.content });
        res.status(200).json({
          message: 'Note updated',
          note: note,
          updated: true,
        });
      } else {
        res.status(404).json({
          message: 'Note not found',
          note: null,
          updated: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      note: null,
    });
  }
});

// delete one note
app.delete('/api/user/note/:id', async (req, res) => {
  try {
    const userId = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { id: userId.id } });
    if (user) {
      const note = await Note.findOne({
        where: { id: req.params.id },
      });
      if (note) {
        await note.destroy();
        res.status(200).json({
          message: 'Note deleted',
          deleted: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      deleted: false,
    });
  }
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

async function decodeJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return { error: 'Invalid user detected. Please try again' };
  }
}
