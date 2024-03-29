import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Nav from './components/Nav';
import Login from './components/Login';
import Notes from './components/Notes';
import NotePage from './components/NotePage';
import Friends from './components/Friends';
import GroupNotes from './components/GroupNotes';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  async function checkValid(userToBeChecked) {
    const res = await fetch('http://localhost:3000/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: userToBeChecked?.token,
        mail: userToBeChecked?.email,
      }),
    });
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    const theUser = localStorage.getItem('user');

    if (theUser && !theUser.includes('undefined')) {
      checkValid(JSON.parse(theUser)).then((data) => {
        if (data.valid === true) {
          setUser(JSON.parse(theUser));
        } else {
          localStorage.removeItem('user');
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <div>
      <Nav isLoggedIn={user ? true : false} />
      <main style={{ paddingTop: '104px' }} className='page-width'>
        <Routes>
          <Route
            path='/'
            element={!user ? <Navigate to='/login' /> : <Home user={user} />}
          />
          <Route
            path='/profile'
            element={!user ? <Navigate to='/login' /> : <Profile user={user} />}
          />
          <Route
            path='/notes'
            element={!user ? <Navigate to='/login' /> : <Notes user={user} />}
          />
          <Route
            path='/group/:id/notes'
            element={!user ? <Navigate to='/login' /> : <GroupNotes user={user} />}
          />
          <Route
            path='/note/:id'
            element={!user ? <Navigate to='/login' /> : <NotePage user={user} />}
          />
          <Route path='/login' element={!user ? <Login /> : <Navigate to='/profile' />} />
          <Route
            path='/friends'
            element={!user ? <Navigate to='/login' /> : <Friends user={user} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
