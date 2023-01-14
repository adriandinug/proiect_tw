import { useState } from 'react';

const useFetch = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async (response) => {
    setLoading(true);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential: response.credential }),
    })
      .then((res) => {
        setLoading(false);

        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          // if (!data?.user.email.includes('ase.ro')) {
          //   setError('Please use your ase.ro email address to login!');
          //   return;
          // } else {
          //   localStorage.setItem('user', JSON.stringify(data?.user));
          //   window.location.reload();
          // }
          localStorage.setItem('user', JSON.stringify(data?.user));
          window.location.reload();
        }

        throw new Error(data?.message || data);
      })
      .catch((error) => {
        setError(error?.message);
      });
  };
  return { loading, error, handleGoogle };
};

export default useFetch;
