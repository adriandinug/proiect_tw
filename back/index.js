// start express
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from './db/models/User.js';
import Note from './db/models/Note.js';
import Friend from './db/models/Friend.js';
import Group from './db/models/Group.js';
import UserGroup from './db/models/UserGroup.js';
import NoteGroup from './db/models/NoteGroup.js';
import { sequelize } from './db/connection.js';
import { Op } from 'sequelize';
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

const setDB = async (req = null, res = null) => {
  try {
    User.hasMany(Note, { foreignKey: 'noteOwner', targetKey: 'id', type: 'UUID' });
    Note.belongsTo(User, { foreignKey: 'noteOwner', targetKey: 'id', type: 'UUID' });
    User.belongsToMany(User, {
      as: 'friend',
      through: 'Friend',
      foreignKey: 'userId',
      otherKey: 'friendId',
    });
    User.belongsToMany(Group, {
      through: 'UserGroup',
      foreignKey: 'userId',
      otherKey: 'groupId',
    });
    Group.belongsToMany(User, {
      through: 'UserGroup',
      foreignKey: 'groupId',
      otherKey: 'userId',
    });
    User.hasMany(Group, { foreignKey: 'groupOwner', targetKey: 'id', type: 'UUID' });
    Group.belongsTo(User, { foreignKey: 'groupOwner', targetKey: 'id', type: 'UUID' });
    Group.belongsToMany(Note, {
      through: 'NoteGroup',
      foreignKey: 'groupId',
      otherKey: 'noteId',
    });
    Note.belongsToMany(Group, {
      through: 'NoteGroup',
      foreignKey: 'noteId',
      otherKey: 'groupId',
    });
    await sequelize.sync({});
    // await NoteGroup.sync({});
    // await Group.sync({});
    // await User.sync({});
    // await UserGroup.sync({});
    // await Note.sync({});
    // await Friend.sync({});
    if (res) {
      res.status(200).json({
        message: 'Database was set successfully',
      });
    }
  } catch (err) {
    if (res) {
      res.status(500).json({
        message: 'Database was not set successfully',
      });
    }
    console.log(err);
  }
};

// setDB();

app.get('/api/setdb', async (req, res) => {
  setDB(req, res);
});

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

      if (!existsInDB) {
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

app.get('/api/user/groups', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const groups = await Group.findAll({
        include: {
          model: User,
          where: { id: user.id },
        },
      });
      console.log(groups);
      // count the number of members and notes in each group
      for (let i = 0; i < groups.length; i++) {
        groups[i].dataValues.membersCount = await UserGroup.count({
          where: { groupId: groups[i].groupId },
        });
        groups[i].dataValues.notesCount = await NoteGroup.count({
          where: { groupId: groups[i].groupId },
        });
        groups[i].dataValues.ownerMail = await User.findOne({
          where: { id: groups[i].groupOwner },
          attributes: ['mail'],
        });
      }
      res.status(200).json({
        message: 'Groups fetched successfully',
        groups: groups,
      });
    } else {
      res.status(401).json({
        message: 'Unauthorized',
        groups: [],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err?.message || err,
      groups: [],
    });
  }
});

app.post('/api/user/group', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    console.log(req.body.name);
    const userGroups = await Group.findAll({ where: { groupOwner: user.id } });
    const groupExists = await Group.findOne({
      where: { name: req.body.name },
    });
    if (groupExists) {
      return res.status(400).json({
        message: 'Group name already taken',
      });
    }
    if (userGroups.length >= 5) {
      return res.status(400).json({
        message: 'You can only have 5 groups',
      });
    } else {
      if (user && !token.error && token.id == user.id) {
        const group = await Group.create({
          name: req.body.name,
          groupOwner: user.id,
        });
        await UserGroup.create({
          userId: user.id,
          groupId: group.groupId,
        });
        res.status(200).json({
          message: 'Group created successfully',
          group: group,
        });
      } else {
        res.status(401).json({
          message: 'Unauthorized',
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err?.message || err,
    });
  }
});

app.post('/api/user/group/join', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    const group = await Group.findOne({ where: { name: req.body.groupName } });
    if (group) {
      const userGroup = await UserGroup.findOne({
        where: { userId: user.id, groupId: group.groupId },
      });
      if (userGroup) {
        return res.status(400).json({
          message: 'You are already a member of this group',
        });
      }
      if (user && !token.error && token.id == user.id) {
        await UserGroup.create({
          userId: user.id,
          groupId: group.groupId,
        });
        res.status(200).json({
          message: 'Joined group successfully',
          joined: true,
        });
      }
    } else {
      res.status(404).json({
        message: 'Group not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
});
app.post('/api/user/group/note', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const note = await Note.findOne({ where: { id: req.body.noteId } });
      if (!note) {
        return res.status(400).json({
          message: 'Note not found',
        });
      }
      const group = await Group.findOne({ where: { groupId: req.body.groupId } });
      if (!group) {
        return res.status(400).json({
          message: 'Group not found',
        });
      }
      const noteInGroup = await NoteGroup.findOne({
        where: { noteId: note.id, groupId: group.groupId },
      });
      if (noteInGroup) {
        return res.status(400).json({
          message: 'Note already in group',
        });
      }
      const noteGroup = await NoteGroup.create({
        noteId: note.id,
        groupId: group.groupId,
      });
      res.status(200).json({
        message: 'Note added to group successfully',
        noteGroup: noteGroup,
      });
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err?.message || err,
    });
  }
});

app.get('/api/groups/notes', async (req, res) => {
  try {
    const groupId = req.get('group-id');
    const group = await Group.findOne({ where: { groupId: groupId } });
    if (group) {
      const notes = await Group.findOne({
        where: { groupId: groupId },
        include: [
          {
            model: Note,
          },
        ],
      });
      if (notes) {
        res.status(200).json({
          message: 'Notes found',
          notes: notes.Notes,
        });
      } else {
        res.status(404).json({
          message: 'Notes not found',
          notes: [],
        });
      }
    } else {
      res.status(404).json({
        message: 'Group not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

app.delete('/api/user/group', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const group = await Group.findOne({ where: { id: req.body.groupId } });
      if (group) {
        await group.destroy();
        res.status(200).json({
          message: 'Group deleted successfully',
        });
      } else {
        res.status(404).json({
          message: 'Group not found',
        });
      }
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err?.message || err,
    });
  }
});

app.post('/api/user/share', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const friendId = req.body.friendId;
    const noteId = req.body.noteId;
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const friend = await User.findByPk(friendId);
      if (friend) {
        const alreadyShared = await Note.findOne({
          where: { originalSharedId: noteId, noteOwner: friendId },
        });
        if (!alreadyShared) {
          const note = await Note.findByPk(noteId);
          if (note) {
            const newNote = await Note.create({
              fileName: note.fileName,
              content: note.content,
              materie: note.materie,
              type: note.type,
              tags: note.tags,
              originalSharedId: noteId,
            });
            await newNote.setUser(friend);
            res.status(200).json({
              message: 'Note was shared successfully',
            });
          } else {
            res.status(404).json({
              message: 'Note not found',
            });
          }
        } else {
          res.status(400).json({
            message: 'Note was already shared to this user',
          });
        }
      } else {
        res.status(404).json({
          message: 'Friend not found',
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

app.post('/api/user/add', async (req, res) => {
  try {
    const mail = req.get('user-email');
    console.log(req.get('user-token'));
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const friend = await User.findByPk(req.body.friend);
      if (friend) {
        const exists = await Friend.findOne({
          where: { userId: user.id, friendId: friend.id },
        });
        if (!exists) {
          await Friend.create({
            userId: user.id,
            friendId: friend.id,
          });
          res.status(200).json({
            message: 'Friend added successfully',
          });
        } else {
          res.status(400).json({
            message: 'Friend already added',
          });
        }
      } else {
        res.status(404).json({
          message: 'User not found',
        });
      }
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      users: [],
    });
  }
});

app.post('/api/user/search', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const userFriends = await Friend.findAll({ where: { userId: user.id } });
      let userFriendsIds = [];
      if (userFriends?.length > 0) {
        userFriendsIds = userFriends.map((friend) => friend.friendId);
      }
      const users = await User.findAll({
        where: {
          mail: { [Op.like]: '%' + req.body.search + '%', [Op.not]: mail },
          id: { [Op.notIn]: userFriendsIds },
        },
      });
      if (users.length > 0) {
        res.status(200).json({
          message: 'Users found',
          users: users,
        });
      } else {
        res.status(404).json({
          message: 'No users found',
          users: [],
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
      users: [],
    });
  }
});

app.get('/api/user/last', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const notes = await Note.findAll({
        where: { noteOwner: user.id },
        order: [['updatedAt', 'DESC']],
        limit: 1,
      });
      if (notes.length > 0) {
        const note = notes[0];
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

app.get('/api/user/friends', async (req, res) => {
  try {
    const mail = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: mail } });
    if (user && !token.error && token.id == user.id) {
      const friends = await Friend.findAll({ where: { userId: user.id } });
      if (friends.length > 0) {
        let friendsIds = friends.map((friend) => friend.friendId);
        const friendsData = await User.findAll({
          where: { id: friendsIds },
        });
        res.status(200).json({
          message: 'Friends found',
          friends: friendsData,
        });
      } else {
        res.status(404).json({
          message: 'No friends found',
          friends: [],
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || error,
    });
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
        user: Object.assign({}, user.dataValues),
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
    const email = req.get('user-email');
    const token = await decodeJWT(req.get('user-token'));
    const user = await User.findOne({ where: { mail: email } });
    if (user && !token.error && token.id == user.id) {
      await Note.sync();
      const noteToSave = await Note.create({
        content: note,
      });
      await noteToSave.setUser(user);
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
        where: { noteOwner: user.id },
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
    const { content, fileName, type, materie, tags } = req.body;
    if (user) {
      const note = await Note.findOne({
        where: { id: req.params.id },
      });
      console.log(tags);
      const newTags = tags ? tags : '';
      if (note) {
        await note.update({
          content,
          fileName,
          materie,
          type,
          tags: newTags,
        });
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
