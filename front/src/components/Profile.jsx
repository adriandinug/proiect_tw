import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/profile.css';

function Profile({ user }) {
  const testNote = `
  # Welcome to the Student Notes App!
  ## Second heading
  ### Third heading
  #### Fourth heading
  ##### Fifth heading
  paragraph

  **bold**

  *italic*

  ***bold and italic***

  > blockquote asdadas

  \`code code code\`

  * List1
  * List 2
  * List 3
  
  1. List1
  2. List2
  3. List3


  ![Image](https://source.unsplash.com/random/300x300)
  ---

  test
  `;
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/get-last-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNote(data.noteText);
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const saveNote = async () => {
    if (user) {
      let currId = '';
      if (currentNote !== '') {
        currId = currentNote;
      }
      console.log(note);
      const save = await fetch(`http://localhost:3000/api/save-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: note, email: user.email, id: currId }),
      });
      const data = await save.json();
      console.log(data);
      if (data.saved) {
        if (currentNote === '') {
          setCurrentNote(data.noteId);
        }
        setSaved(true);
      }
    }
  };

  return (
    <div className='profile'>
      {user ? (
        <>
          <h2>This is my profile</h2>
          <p>My email is {user?.email}</p>
          <p>
            My name is {user?.firstName} {user?.lastName}
          </p>
          <img src={user?.picture} alt='' />
          <div style={{ marginTop: '20px' }}>
            <button className='btn btn--primary' onClick={logout}>
              LOG OUT
            </button>
            <button
              style={{ marginLeft: '20px' }}
              className='btn btn--secondary'
              onClick={saveNote}
            >
              SAVE
            </button>
          </div>
        </>
      ) : (
        <h2>You are not logged in</h2>
      )}
      <h3 style={{ color: saved ? 'green' : 'red', marginTop: '20px' }}>
        {saved ? 'Saved' : 'Not Saved'}
      </h3>
      <div className='markdown'>
        <textarea
          name='mark'
          id=''
          cols='40'
          rows='20'
          style={{ resize: 'none' }}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
        ></textarea>
        <ReactMarkdown className='markdown-wrapper' children={note}></ReactMarkdown>
      </div>
    </div>
  );
}

export default Profile;
