import Note from './Note';
import { useEffect } from 'react';
import '../styles/notes_list.css';

function NotesList({ notes, user }) {
  useEffect(() => {
    if (!user) {
      user = JSON.parse(localStorage.getItem('user'));
    }
  }, []);

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
        {notes.map((note) => (
          <Note key={note.id} note={note} user={user} />
        ))}
      </div>
    </div>
  );
}

export default NotesList;
