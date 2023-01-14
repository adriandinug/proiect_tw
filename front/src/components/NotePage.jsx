import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { debounce } from '../utils/debounce';
import EditNote from './EditNote';
import '../styles/note_page.css';

function NotePage({ user }) {
  const params = useParams();
  const { id } = params;
  const [note, setNote] = useState(null);
  const [found, setFound] = useState(true);
  const [full, setFull] = useState(true);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState('');
  const thisUser = useRef(user);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (note) {
      setContent(note.content);
      console.log(note);
    }
  }, [note]);

  useEffect(() => {
    if (searchParams.get('edit')) {
      setEdit(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      thisUser.current = JSON.parse(localStorage.getItem('user'));
    }
    fetch('http://localhost:3000/api/user/note/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': thisUser.current.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNote(data.note);
        setFound(data.found);
      });
  }, [id, user]);

  const updateNote = debounce(() => {
    const data = {
      fileName: note.fileName,
      type: note.type,
      materie: note.materie,
      content: content,
      tags: note.tags,
    };
    fetch('http://localhost:3000/api/user/note/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': thisUser.current.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNote(data.note);
        setFound(data.found);
      });
  }, 500);

  return (
    <div className='note-page'>
      {note ? (
        <div className='note-wrapper'>
          <div className='general-info'>
            <h4>{note.fileName}</h4>
            <p>
              {note.type} - {note.materie}
            </p>
          </div>
          <div className='note-buttons'>
            <button className='button button--secondary' onClick={() => setEdit(!edit)}>
              Edit
            </button>

            {!edit && (
              <>
                <button
                  className='button button--secondary'
                  onClick={() => setFull(!full)}
                >
                  Switch design
                </button>
                <button className='button button--save' onClick={() => updateNote()}>
                  Save
                </button>
              </>
            )}
            {!edit && full && (
              <button className='button button--primary' onClick={() => setShow(!show)}>
                Switch view
              </button>
            )}
          </div>
          {edit ? (
            <EditNote user={user} updateNote={setNote} />
          ) : full ? (
            <div className={show ? 'note-content full show' : 'note-content full'}>
              {show ? (
                <ReactMarkdown
                  className='markdown-wrapper'
                  children={content}
                ></ReactMarkdown>
              ) : (
                <textarea
                  name='note'
                  id='note'
                  style={{ resize: 'none' }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              )}
            </div>
          ) : (
            <div className='note-content half'>
              <textarea
                name='note'
                id='note'
                style={{ resize: 'none' }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <ReactMarkdown
                className='markdown-wrapper'
                children={content}
              ></ReactMarkdown>
            </div>
          )}
        </div>
      ) : !found ? (
        <p>Not found</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default NotePage;
