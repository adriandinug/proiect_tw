import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/groups.css';

function Groups({ user }) {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState([]);
  const [shareMessage, setShareMessage] = useState(null);
  const [groupMessage, setGroupMessage] = useState('');

  const getGroups = useCallback(() => {
    fetch('http://localhost:3000/api/user/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.groups);
      });
  }, [user]);

  useEffect(() => {
    getGroups();

    fetch('http://localhost:3000/api/user/notes/' + user.token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes);
      });
  }, [user, getGroups]);

  const createGroup = () => {
    if (name.length <= 0) return;
    fetch('http://localhost:3000/api/user/group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.group) {
          const newGroup = data.group;
          newGroup.membersCount = 1;
          newGroup.notesCount = 0;
          newGroup.ownerMail = { mail: user.email };
          setGroups([...groups, data.group]);
        } else {
          setGroupMessage(data.message);
        }
      });
  };

  const shareNote = (e) => {
    const val = e.target.parentElement.querySelector('select').value;
    fetch('http://localhost:3000/api/user/group/note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
      body: JSON.stringify({ noteId: val, groupId: e.target.dataset.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.noteGroup) {
          getGroups();
        }
        const newShareMessage = { ...shareMessage };
        newShareMessage[e.target.dataset.id] = data.message;
        setShareMessage(newShareMessage);
        console.log(newShareMessage);
      });
  };

  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');

  const joinGroup = () => {
    if (groupName === '') return;
    fetch('http://localhost:3000/api/user/group/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
      body: JSON.stringify({ groupName: groupName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.joined) {
          setMessage(data.message);
          return;
        } else {
          getGroups();
        }
        setGroupName('');
        setMessage(data.message);
      });
  };

  return (
    <div>
      <div className='join-groups'>
        <h4>Join a group</h4>
        <div>
          <input
            type='text'
            placeholder='Group name'
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
          <button className='button button-secondary' onClick={joinGroup}>
            Join
          </button>
          <p>{message}</p>
        </div>
      </div>
      <div>
        <h4>Create a group to share your notes with!</h4>
        <div className='name'>
          <label htmlFor='name'>Group name</label>
          <input
            type='text'
            id='name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <span>{groupMessage}</span>
        </div>
        <div>
          <button className='button button--secondary' onClick={createGroup}>
            New group
          </button>
        </div>
        {groups.length === 0 ? <h5>No groups found.</h5> : <h5>Groups I'm part of:</h5>}
        <div className='group-list'>
          {groups.map((group) => (
            <div className='group' key={group.groupId}>
              <h6>{group.name}</h6>
              <p>Member count: {group.membersCount}</p>
              <p>Notes count: {group.notesCount}</p>
              <p>Group owner: {group.ownerMail.mail}</p>
              {notes.length === 0 ? (
                <p>No notes found.</p>
              ) : (
                <>
                  <select name='share' id='share'>
                    {notes.map((note) => (
                      <option key={note.id} value={note.id}>
                        {note.fileName} - {note.type} - {note.materie}
                      </option>
                    ))}
                  </select>

                  <button
                    className='button button--primary'
                    data-id={group.groupId}
                    onClick={shareNote}
                  >
                    Share
                  </button>
                </>
              )}
              <p>{shareMessage && (shareMessage[group.groupId] || '')}</p>
              <Link
                to={'/group/' + group.groupId + '/notes'}
                className='button button--secondary'
                style={{ textDecoration: 'none' }}
              >
                See group notes
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Groups;
