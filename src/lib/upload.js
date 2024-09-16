import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Import your Firebase storage reference

const upload = async (file) => {
  // Get the current timestamp to create a unique file name
  const timestamp = new Date().getTime(); 
  const storageRef = ref(storage, `images/${timestamp}_${file.name}`); // Using a unique file name

  // Start uploading the file with uploadBytesResumable
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Return a Promise to handle async upload and URL retrieval
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle upload errors
        reject(`Something went wrong: ${error.code}`);
      },
      () => {
        // On successful upload, retrieve the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL); // Resolve with the download URL
          })
          .catch((error) => {
            // Handle any errors that occur while getting the download URL
            reject(`Error getting download URL: ${error}`);
          });
      }
    );
  });
};

export default upload;
