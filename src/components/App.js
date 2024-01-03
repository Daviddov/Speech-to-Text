import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import SpeechToTextWithChatGPT from './SpeechToTextWithChatGPT';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Log out function to log the user out of Google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  const responseMessage = (response) => {
    console.log(response);
    // setUser(response)
};
const errorMessage = (error) => {
    console.log(error);
};
  return (
    <div className="App">
      <h2>TalkBot</h2>

      {profile ? (
        <div>

          <img src={profile.picture} alt="user image" />
          <div>Name: {profile.name}</div>
          {/* <div>Email Address: {profile.email}</div> */}
          <button onClick={logOut}>Log out</button>
            <br/>
            <br/>
            <br/>
          <SpeechToTextWithChatGPT profile={profile} />
        </div>
      ) : (
        <>
           <button onClick={() => login()}>Sign in with Google </button> 
        </>
      )}
    </div>
  );
}

export default App;
