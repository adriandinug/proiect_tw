import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Nav from './components/Nav';
import Login from './components/Login';
import { useState, useEffect } from 'react';

function App() {
  const [offset, setOffset] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const theUser = localStorage.getItem('user');

    if (theUser && !theUser.includes('undefined')) {
      setUser(JSON.parse(theUser));
    }
  }, []);

  return (
    <div>
      <Nav setOffset={setOffset} />
      <main style={{ paddingTop: offset + 'px' }} className='page-width'>
        <Routes>
          a
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile user={user} />} />
          <Route path='/login' element={!user ? <Login /> : <Navigate to='/profile' />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
