import Note from './Note';
import { useEffect, useRef } from 'react';
import '../styles/notes_list.css';

function NotesList({ notes, user, refresh }) {
  const thisUser = useRef(user);

  useEffect(() => {
    if (!user) {
      thisUser.current = JSON.parse(localStorage.getItem('user'));
    }
  }, [user]);

  return (
    <div className='notesList'>
      <div className='notes-grid'>
        <div className='headers'>
          <p className='note-name h6'>Note name</p>
          <p className='note-type h6'>Type - Subject</p>
          <p className='note-created h6'>Created at</p>
          <p className='note-updated h6'>Updated at</p>
          {/* <p className='note-actions h6'>Actions</p> */}
        </div>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note key={note.id} note={note} user={user} refresh={refresh} />
          ))
        ) : (
          <p style={{ paddingLeft: '10px' }}>You have no notes.</p>
        )}
      </div>
    </div>
  );
}

export default NotesList;
