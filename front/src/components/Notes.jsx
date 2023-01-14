import Filters from './Filters';
import NotesList from './NotesList';
import { useNavigate } from 'react-router-dom';
import '../styles/notes.css';
import { useState, useEffect, useRef, useCallback } from 'react';

function Notes({ user }) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const thisUser = useRef(user);

  const getNotes = useCallback(() => {
    if (thisUser.current) {
      fetch('http://localhost:3000/api/user/notes/' + thisUser.current.token, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNotes(data.notes);
          setFilteredNotes(data.notes);
        });
    }
  }, [thisUser]);

  useEffect(() => {
    if (!user) {
      thisUser.current = JSON.parse(localStorage.getItem('user'));
    }
    getNotes();
  }, [user, getNotes]);

  const createNote = () => {
    fetch('http://localhost:3000/api/user/note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': thisUser.current.token,
        'User-Email': thisUser.current.email,
      },
      body: JSON.stringify({ note: '' }),
    })
      .then((res) => res.json())
      .then((data) => {
        const id = data.note.id;
        navigate('/note/' + id + '?edit=true');
      });
  };

  return (
    <div className='notes'>
      <div className='new-note'>
        <h4>Create new note</h4>
        <button onClick={createNote}>New</button>
      </div>
      <Filters notes={notes || []} changeNotes={setFilteredNotes} />
      <NotesList notes={filteredNotes || []} user={user} refresh={getNotes} />
    </div>
  );
}

export default Notes;
