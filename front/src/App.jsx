import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Nav from './components/Nav';
import { useState } from 'react';

function App() {
  const [offset, setOffset] = useState(0);

  return (
    <div>
      <Nav setOffset={setOffset} />
      <main style={{ paddingTop: offset + 'px' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
