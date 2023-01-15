import FriendsSearch from './FriendsSearch.jsx';
import Groups from './Groups.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home({ user }) {
  const navigate = useNavigate();

  const createNote = () => {
    fetch('http://localhost:3000/api/user/note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
      body: JSON.stringify({ note: '' }),
    })
      .then((res) => res.json())
      .then((data) => {
        const id = data.note.id;
        navigate('/note/' + id + '?edit=true');
      });
  };

  return (
    <div className='home'>
      <div className='friends'>
        <h4>Search for friends to share your notes with!</h4>
        <FriendsSearch user={user} />
      </div>
      <div className='new-note'>
        <h4>Create new note</h4>
        <button onClick={createNote}>New</button>
      </div>
      <div className='groups'>
        <Groups user={user} />
      </div>
    </div>
  );
}

export default Home;
