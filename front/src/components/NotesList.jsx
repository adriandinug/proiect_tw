import Note from './Note';
import { useEffect, useRef, useState } from 'react';
import '../styles/notes_list.css';

function NotesList({ notes, user, refresh }) {
  const thisUser = useRef(user);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (!user) {
      thisUser.current = JSON.parse(localStorage.getItem('user'));
    } else {
      fetch('http://localhost:3000/api/user/' + user.token, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.user.id);
        });
    }
  }, [user]);

  return (
    <div className='notesList'>
      <div className='notes-grid'>
        <div className='headers'>
          <p className='note-name h6'>Note name</p>
          <p className='note-type h6'>Type</p>
          <p className='note-subject h6'>Subject</p>
          <p className='note-created h6'>Created at</p>
          <p className='note-updated h6'>Updated at</p>
        </div>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              user={user}
              refresh={refresh}
              admin={userId === note.noteOwner}
            />
          ))
        ) : (
          <p style={{ paddingLeft: '10px' }}>You have no notes.</p>
        )}
      </div>
    </div>
  );
}

export default NotesList;
