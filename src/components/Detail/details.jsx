import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Ensure Firestore is correctly imported
import "./details.css";

const Details = ({ user, handleLogout }) => {
  const [userData, setUserData] = useState(null); // State to store user details

  useEffect(() => {
    if (user?.uid) {
      // Listen for changes to the user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        setUserData(doc.data()); // Update local state with user data
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    }
  }, [user?.uid]);

  return (
    <div className="details">
      <div className="user">
        <img src={userData?.avatar || "./avatar.png"} alt="" /> {/* Display user avatar */}
        <h2>{userData?.username || "User Name"}</h2> {/* Display user name */}
        <p>{userData?.bio || "Go with the flow."}</p> {/* Display user bio */}
      </div>
      <div className="info">
        <div className="option">
          <div className="photos">
            {userData?.sharedPhotos?.map((photo, index) => (
              <div className="photoItem" key={index}>
                <div className="photoDetail">
                  <img src={photo.url} alt={`Shared photo ${index}`} />
                  <span>{photo.name}</span>
                </div>
                <img src="./download.png" alt="" className="icon" />
              </div>
            ))}
          </div>
        </div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Details;
