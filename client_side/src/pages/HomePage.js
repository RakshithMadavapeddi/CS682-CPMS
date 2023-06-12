import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSignInClick = (event) => {
    event.preventDefault();
    navigate('/signin');
  };

  return (
    <div>
      <div>
        <div>Home</div>
        <div>Contact</div>
        <button onClick={handleSignInClick}>Sign In</button>
        <div>Help</div>
      </div>
      <div>Content place</div>
    </div>
  );
}
