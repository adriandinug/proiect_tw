import FriendsSearch from './FriendsSearch.jsx';

function Home({ user }) {
  return (
    <div className='home'>
      <div className='friends'>
        <h3>Search for friends to share your notes with!</h3>
        <FriendsSearch />
      </div>
      <div className='new-note'></div>
    </div>
  );
}

export default Home;
