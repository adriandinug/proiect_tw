import Notes from './Notes';

function Home({ user }) {
  return (
    <div className='home'>
      <h2>This is home</h2>
      <Notes user={user} />
    </div>
  );
}

export default Home;
