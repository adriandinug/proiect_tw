import '../styles/profile.css';

function Profile({ user }) {
  const logout = () => {
    localStorage.removeItem('user');
    window.location.reload();
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
            <button className='button button--primary' onClick={logout}>
              LOG OUT
            </button>
          </div>
        </>
      ) : (
        <h2>You are not logged in</h2>
      )}
    </div>
  );
}

export default Profile;
