import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    });

    if (response.ok) {
      navigate('/dashboard', { replace: true });
    } else if (response.status === 400){
      setErrorMessage('Username/ Password missing');
    } else if (response.status === 401) {
        setErrorMessage('Wrong Username/ Password');  
    } else {
        setErrorMessage('Internal server error. Try again');
    }
  };

  return (
    <div>
      <h1>Sign in Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div id="error" style={{ color: "red" }}>
          {errorMessage}
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
