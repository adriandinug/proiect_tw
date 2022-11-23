import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function Profile({ user }) {
  const [note, setNote] = useState(`
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

  ---

  test

  test
  `);

  const logout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };
  return (
    <div className='profile' style={{ paddingBottom: '100px' }}>
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
          </div>
        </>
      ) : (
        <h2>You are not logged in</h2>
      )}
      <div
        className='markdown'
        style={{ marginTop: '30px', display: 'flex', gap: '50px' }}
      >
        <textarea
          name='mark'
          id=''
          cols='40'
          rows='20'
          style={{ resize: 'none' }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <ReactMarkdown className='markdown-wrapper' children={note}></ReactMarkdown>
      </div>
    </div>
  );
}

export default Profile;
