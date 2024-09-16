import { create } from 'zustand';
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase';

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  
  fetchUserInfo: async (uid) => {
    // Handle invalid UID early
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      // Fetch user document from Firestore
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the user document exists, update the state
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        // If no user document found, clear currentUser
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      // Handle error by clearing user and stopping the loading state
      set({ currentUser: null, isLoading: false });
    }
  },
}));

export default useUserStore;
