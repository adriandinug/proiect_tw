import { useState } from 'react';
import '../styles/friends_search.css';

function FriendsSearch({ user }) {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);

  const searchFriends = () => {
    if (search === '') return;
    fetch('http://localhost:3000/api/user/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
        'User-Email': user.email,
      },
      body: JSON.stringify({ search }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFriends(data.users);
      });
  };

  const addFriend = (e) => {
    fetch('http://localhost:3000/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Email': user.email,
        'User-Token': user.token,
      },
      body: JSON.stringify({ friend: e.target.dataset.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        searchFriends();
      });
  };

  return (
    <div>
      <h5>Search friends</h5>
      <div className='search-bar'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchFriends()}
        />
        <button className='button button--secondary' onClick={searchFriends}>
          Search
        </button>
      </div>
      <div className='friends-search'>
        {friends.length === 0 && <h4>No users found.</h4>}
        {friends.map((friend) => (
          <>
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
              <button
                className='button button--primary'
                data-id={friend.id}
                onClick={addFriend}
              >
                Add
              </button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default FriendsSearch;
