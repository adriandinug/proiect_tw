import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/note.css';

function Note({ note, user, refresh }) {
  const thisUser = useRef(user);

  useEffect(() => {
    if (!user) {
      thisUser.current = JSON.parse(localStorage.getItem('user'));
    }
  }, [user]);

  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      .replace(/ /g, '-');
  };

  const deleteNote = () => {
    fetch('http://localhost:3000/api/user/note/' + note.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': thisUser.current.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        refresh();
      });
  };

  return (
    <div className='note'>
      <div className='note-name'>
        <p>{note.fileName}</p>
      </div>
      <div className='note-type'>
        <p>{note.type}</p>
      </div>
      <div className='note-subject'>
        <p>{note.materie}</p>
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
        <button onClick={() => deleteNote()} className='button-delete'>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Note;
