import React, { useState, useEffect } from 'react';
import './chatList.css';
import AddUser from './addUser/addUser';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore'; // Firestore methods

const ChatList = ({ setSelectedUser }) => {
  const [addMode, setAddMode] = useState(false);
  const [users, setUsers] = useState([]); // Store users list
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query

  // Fetch users in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });
    return () => unsubscribe();
  }, []);

  // Filtered users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src='/search.png' alt="" />
          <input 
            type='text' 
            placeholder='search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          />
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt='plus'
          className='add'
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {/* Display the list of filtered users */}
      {filteredUsers.map((user) => (
        <div
          className="item"
          key={user.id}
          onClick={() => setSelectedUser(user)} // Set selected user on click
        >
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>{user.username}</span>
            <p>{user.email}</p>
          </div>
        </div>
      ))}
      
      {/* Conditionally show AddUser component */}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
