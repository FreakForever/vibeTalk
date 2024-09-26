import { useEffect, useState } from "react";
import Chat from "./components/chat/chat";
import Details from "./components/Detail/details";
import List from "./components/list/list";
import Login from "./components/login/login";
import Notification from "./components/notification/notification";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./lib/firebase"; // Ensure both auth and db (Firestore) are imported correctly
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions

const App = () => {
  const [user, setUser] = useState(null); // Initialize user state to null
  const [messages, setMessages] = useState([]); // State for storing chat messages

  // Handle the latest authentication status
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser); // Update user state with the current authenticated user
    });

    return () => {
      unSub(); // Cleanup subscription
    };
  }, []);

  // Real-time Firestore messages listener
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "messages"), orderBy("timestamp", "asc")); // Order messages by timestamp
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(loadedMessages); // Set the state with the new messages
      });

      return () => unsubscribe(); // Cleanup Firestore listener
    }
  }, [user]);

  // Function to send a message
  const sendMessage = async (text) => {
    if (!text) return; // Don't send empty messages
    try {
      await addDoc(collection(db, "messages"), {
        text,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: serverTimestamp(), // Add timestamp for proper ordering
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      setUser(null); // Clear user state after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container">
      {user ? (
        <>
          {/* Pass user, messages, and sendMessage as props to components */}
          <List user={user} />
          <Chat user={user} messages={messages} sendMessage={sendMessage} />
          <Details user={user} handleLogout={handleLogout} />
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
