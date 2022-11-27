import Filtres from './Filtres';
import NotesList from './NotesList';
import { useState, useEffect, useRef, useCallback } from 'react';

function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const thisUser = useRef(user);

  const getNotes = useCallback(() => {
    console.log('x');
    fetch('http://localhost:3000/api/user/notes/' + thisUser.current.token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes);
      });
  }, [thisUser]);

  useEffect(() => {
    if (!user) {
      thisUser.current = JSON.parse(localStorage.getItem('user'));
    }
    getNotes();
  }, [user, getNotes]);

  return (
    <div className='notes'>
      <Filtres />
      <NotesList notes={notes || []} user={user} refresh={getNotes} />
    </div>
  );
}

export default Notes;
