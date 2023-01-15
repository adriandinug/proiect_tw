import { useEffect, useState } from 'react';
import '../styles/friends_list.css';

function Friends({ user }) {
  const [friends, setFriends] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/user/friends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFriends(data.friends);
      });

    fetch('http://localhost:3000/api/user/notes/' + user.token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes);
      });
  }, [user]);

  const shareFriend = (e) => {
    const val = e.target.parentElement.querySelector('select').value;
    fetch('http://localhost:3000/api/user/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
      body: JSON.stringify({ friendId: e.target.dataset.id, noteId: val }),
    })
      .then((res) => res.json())
      .then((data) => {});
  };

  return (
    <div className='friends'>
      <h3>Friends</h3>
      <div className='friends-list'>
        {friends.length === 0 && <h4>No friends found.</h4>}
        {friends.map((friend) => (
          <div key={friend.id} className='friend'>
            <div>
              <h5>
                Nume: {friend.nume} {friend.prenume}
              </h5>
              <p>Mail: {friend.mail}</p>
              <div className='friend-image'>
                <p>Poza: </p>
                <img src={friend.picture} alt='' />
              </div>
            </div>
            <div className='share-friend'>
              <h5>Notes</h5>
              <select>
                {notes.map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.fileName} - {note.type} - {note.materie}
                  </option>
                ))}
              </select>
              <button
                className='button button--primary'
                data-id={friend.id}
                onClick={shareFriend}
              >
                Share to friend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Friends;
