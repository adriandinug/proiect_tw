import Filtres from './Filtres';
import NotesList from './NotesList';
import { useState, useEffect } from 'react';

function Notes({ user }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) {
      user = JSON.parse(localStorage.getItem('user'));
    }
    fetch('http://localhost:3000/api/user/notes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Email': user.email,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes);
      });
  }, []);

  return (
    <div className='notes'>
      <Filtres />
      <NotesList notes={notes || []} user={user} />
    </div>
  );
}

export default Notes;
