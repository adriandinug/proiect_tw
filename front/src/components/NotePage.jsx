import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NotePage({ user }) {
  const params = useParams();
  const { id } = params;
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!user) {
      user = JSON.parse(localStorage.getItem('user'));
    }
    fetch('http://localhost:3000/api/user/notes/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Email': user.email,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNote(data.note);
      });
  }, []);

  return (
    <div className='note-page'>
      <h5>This is the note page</h5>
      <p>Id: {id}</p>
      <p>Name: {note?.fileName}</p>
      <p>Materie: {note?.materie}</p>
      <p>Type: {note?.type}</p>
      <p>Content: {note?.content}</p>
    </div>
  );
}

export default NotePage;
