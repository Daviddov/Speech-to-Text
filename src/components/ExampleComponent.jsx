// ExampleComponent.js

import React, { useEffect, useState } from 'react';
import firebase from './firebaseC'; // Adjust the path based on your project structure

const ExampleComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Create a reference to your Firebase Realtime Database
    const database = firebase.database();
    const dataRef = database.ref('your-data-node'); // Replace 'your-data-node' with your actual node name

    // Set up a listener for changes in data
    dataRef.on('value', (snapshot) => {
      // Update the state with the new data
      setData(snapshot.val());
    });

    // Clean up the listener when the component is unmounted
    return () => {
      dataRef.off('value');
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Data from Firebase:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ExampleComponent;
