import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import './Login.css'; // Import the CSS file
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth methods
import { auth } from '../../lib/firebase'; // Import your Firebase config
import { db } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import upload from '../../lib/upload';

const Login = () => {
  const [selectedImage, setSelectedImage] = useState(null); // Store the file itself
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // State for loading

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the file itself for upload later
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    if (!loginData.email || !loginData.password) {
      toast.error('Please fill out all fields.');
      setLoading(false); // Hide loader
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      toast.success(`Logged in as ${user.email}`);
    } catch (err) {
      toast.error(`Login failed: ${err.message}`);
    } finally {
      setLoading(false); // Hide loader after login process
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    if (!registerData.username || !registerData.email || !registerData.password) {
      toast.error('Please fill out all fields.');
      setLoading(false); // Hide loader
      return;
    }

    if (!selectedImage) {
      toast.error('Please upload an image.');
      setLoading(false); // Hide loader
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
      const imgUrl = await upload(selectedImage);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        username: registerData.username,
        email: registerData.email,
        avatar: imgUrl,
        id: userId,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", userId), {
        chats: [],
      });

      toast.success(`Account created for ${registerData.username}`);
      setLoginData({ email: '', password: '' });
      setRegisterData({ username: '', email: '', password: '' });
      setSelectedImage(null);
      
    } catch (err) {
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false); // Hide loader after registration process
    }
  };

  return (
    <div className="container">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      
      <div className="form-container">
        <div className="form-section login-section">
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              name="email"
              className="input-field"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button type="submit" className="form-button">Sign In</button>
          </form>
        </div>

        <div className="separator">
          <span>OR</span>
        </div>

        <div className="form-section signup-section">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="file" className="upload-label">Upload an Image</label>
            <input
              type="file"
              id="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="input-field"
              value={registerData.username}
              onChange={handleRegisterChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              className="input-field"
              value={registerData.email}
              onChange={handleRegisterChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="input-field"
              value={registerData.password}
              onChange={handleRegisterChange}
            />
            <button type="submit" className="form-button">Create Account</button>
          </form>

          {selectedImage && (
            <div className="image-preview">
              <h4>Selected Avatar:</h4>
              <img src={URL.createObjectURL(selectedImage)} alt="Avatar" className="avatar-image" />
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default Login;
