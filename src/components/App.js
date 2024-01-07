import React, { useState, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css';
import TalkBot from './TalkBot';
import GoogleIcon from 'mdi-material-ui/Google';

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

  return (
    <div className="App">
      <h2>TalkBot</h2>

      {profile ? (
        <div>
          {/* <img src={profile.picture} alt="user image" /> */}
          {/* <div>Email Address: {profile.email}</div> */}
          Wellcome: {profile.name}  
          <Button variant="contained" color="primary" onClick={logOut}>
           Log out
          </Button>
          <br />
          <br />
          <br />
          <TalkBot profile={profile} />
        </div>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={() => login()}
          >
            Sign in with Google
          </Button>
        </>
      )}
    </div>
  );
}

export default App;
