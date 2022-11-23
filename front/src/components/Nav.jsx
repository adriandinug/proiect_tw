import { Link } from 'react-router-dom';
import '../styles/nav.css';
import { useState, useRef, useEffect } from 'react';

function Nav({ setOffset }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current.getBoundingClientRect();

    setOffset(header.height);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      <header className='header sticky-header' ref={headerRef}>
        <div
          className={'open-drawer' + (open ? ' close' : '')}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <img src={open ? '/close.svg' : '/hamburger.svg'} alt='' />
        </div>
        <div className='logo'>
          <Link to='/'>
            <img src='/logo.svg' alt='' />
            <h4>Student Notes App</h4>
          </Link>
        </div>
        <p>
          <Link to='/profile'>Account</Link>
        </p>
        <div className={'nav-drawer' + (open ? ' open' : '')}>
          <nav className='nav'>
            <ul>
              <li>
                <Link to='/' onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/profile' onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to='/login' onClick={() => setOpen(false)}>
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Nav;
