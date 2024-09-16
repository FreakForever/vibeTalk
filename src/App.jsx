import { useEffect, useState } from "react";
import Chat from "./components/chat/chat";
import Details from "./components/detail/details";
import List from "./components/list/list";
import Login from "./components/login/login";
import Notification from "./components/notification/notification";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./lib/firebase"; // Ensure auth is imported correctly

const App = () => {
  const [user, setUser] = useState(null); // Initialize user state to null

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
          {/* Pass the current user as a prop to List, Chat, and Details */}
          <List user={user} />
          <Chat user={user} />
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
