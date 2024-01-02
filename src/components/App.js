import './App.css'; // Import your CSS file

import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import SpeechToTextWithChatGPT from './SpeechToTextWithChatGPT';

function App() {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <div className="App" >
            <h2>TalkBot</h2>
            <br />
            <br />
            {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <button onClick={logOut}>Log out</button>
                    <SpeechToTextWithChatGPT />
                </div>
            ) : (
              <>
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
                {/* <GoogleLogin onSuccess={(codeResponse) => setUser(codeResponse)} onError={(error) => console.log('Login Failed:', error)} /> */}
              </>

            )}
        </div>
    );
}
export default App;