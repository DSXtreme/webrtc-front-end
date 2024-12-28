"use client"
import React, { useState } from 'react';
// import firebase from 'firebase/app';

import { useRouter } from 'next/navigation';


const LoginPage = () => {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
   
    try {
      // await firebase.auth().signInWithEmailAndPassword(email, password);
      // Redirect or perform other actions on successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={() =>handleLogin()}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
        <div onClick={()=> {router.push("/signup")}}>sign up</div>
      </form>
    </div>
  );
};

export default LoginPage;
