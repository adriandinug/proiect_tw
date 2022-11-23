import useFetch from '../hooks/useFetch';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const { handleGoogle, loading, error } = useFetch('http://localhost:3000/api/login');

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(document.getElementById('loginDiv'), {
        type: 'standard',
        theme: 'filled_black',
        size: 'medium',
        text: 'continue_with',
        shape: 'pill',
      });

      // google.accounts.id.prompt()
    }
  }, [handleGoogle]);

  return (
    <div className='login'>
      <div className='wrapper'>
        <h4>Login to your account on the Notes App platform!</h4>
        {loading ? <div>Loading...</div> : <div id='loginDiv'></div>}
        {error && !error.includes('successful') && <div className='error'>{error}</div>}
      </div>
      <p className='back'>
        Or go back to the <Link to='/'>homepage</Link>
      </p>
    </div>
  );
}

export default Login;
