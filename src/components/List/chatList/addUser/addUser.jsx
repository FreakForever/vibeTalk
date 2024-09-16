import React, { useState } from 'react';
import './addUser.css';
import { db } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Handle adding a new user to Firestore
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Add the new user to the 'users' collection in Firestore
      await addDoc(collection(db, 'users'), {
        username,
        email,
      });

      // Reset input fields after submission
      setUsername('');
      setEmail('');
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
