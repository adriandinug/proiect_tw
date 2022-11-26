import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/note.css';

function Note({ note, user }) {
  useEffect(() => {
    if (!user) {
      user = JSON.parse(localStorage.getItem('user'));
    }
  }, []);

  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      .replace(/ /g, '-');
  };

  return (
    <div className='note'>
      <div className='note-name'>
        <p>{note.fileName}</p>
      </div>
      <div className='note-type'>
        <p>
          {note.type} - {note.materie}
        </p>
      </div>
      <div className='note-created'>
        <p>{formatDate(note.createdAt)}</p>
      </div>
      <div className='note-updated'>
        <p>{formatDate(note.updatedAt)}</p>
      </div>
      <div className='note-actions'>
        <button className='button-view'>
          <Link to={'/note/' + note.id}>View</Link>
        </button>
        <button className='button-delete'>Delete</button>
      </div>
    </div>
  );
}

export default Note;
