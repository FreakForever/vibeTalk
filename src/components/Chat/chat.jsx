import { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase"; // Firestore setup
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Emoji from "emoji-picker-react";
import "./chat.css";

const Chat = () => {
  const [open, setOpen] = useState(false); // Emoji picker state
  const [text, setText] = useState(""); // Message input state
  const [messages, setMessages] = useState([]); // Messages state
  const messageEndRef = useRef(null); // To scroll to the last message

  // Scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages in real-time from Firestore
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Clean up Firestore listener on unmount
  }, []);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!text.trim()) return; // Prevent sending empty messages

    try {
      // Add a new message document to the "chats" collection
      await addDoc(collection(db, "chats"), {
        text,
        sender: "Gobalu", // Update this with the logged-in user's ID or name
        timestamp: serverTimestamp(), // Use Firebase server time for consistency
      });
      setText(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle emoji selection
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji); // Append selected emoji to the message input
    setOpen(false); // Close the emoji picker after selection
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="User Avatar" />
          <div className="texts">
            <span>Gobalu</span>
            <p>Active Chat</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="Phone" />
          <img src="./video.png" alt="Video" />
          <img src="./info.png" alt="Info" />
        </div>
      </div>

      {/* Chat messages displayed in the center section */}
      <div className="center">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`messages ${msg.sender === "Gobalu" ? "own" : ""}`} // Apply "own" class for the current user's messages
          >
            <div className="texts">
              <p>{msg.text}</p>
              <span>
                {msg.timestamp?.seconds
                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()
                  : "Just now"}
              </span>
            </div>
          </div>
        ))}
        {/* Element to scroll into view at the end of the messages */}
        <div ref={messageEndRef}></div>
      </div>

      {/* Bottom section with input, icons, and emoji picker */}
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="Attach Image" />
          <img src="./camera.png" alt="Camera" />
          <img src="./mic.png" alt="Microphone" />
        </div>
        <input
          type="text"
          placeholder="Type a message.."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>

      {/* Emoji picker section */}
      <div className="emoji">
        <img
          src="./emoji.png"
          alt="Emoji"
          onClick={() => setOpen((prev) => !prev)} // Toggle emoji picker visibility
        />
        {open && (
          <div className="picker">
            <Emoji onEmojiClick={handleEmoji} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
