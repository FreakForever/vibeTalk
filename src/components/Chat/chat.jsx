import { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
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
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  // Hardcoded messages for demo purposes
  const hardcodedMessages = [
    { id: 1, text: "Hello!", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 2, text: "How are you?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 3, text: "I'm good, thanks!", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 4, text: "What about you?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
  ];

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

    return () => unsubscribe();
  }, []);

  // Combine hardcoded messages with Firestore messages
  useEffect(() => {
    setMessages((prevMessages) => [...hardcodedMessages, ...prevMessages]);
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
  
    try {
      await addDoc(collection(db, "chats"), {
        text,
        sender: "Gobalu",
        timestamp: serverTimestamp(),
      });
  
      // Array of hardcoded responses
      const autoResponses = [
        "Thanks for your message!",
        "I appreciate your input!",
        "How can I assist you further?",
        "That's interesting!",
        "Thank you for reaching out!",
        "I will get back to you shortly.",
      ];
  
      // Select a random response from the array
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
  
      // Send the random auto-response message
      await addDoc(collection(db, "chats"), {
        text: randomResponse,
        sender: "AutoResponder",
        timestamp: serverTimestamp(),
      });
  
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (e.g., form submission)
      sendMessage(); // Send message
    }
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st%3D1726924118~exp%3D1726927718~hmac%3Dbed62af7df07de6219e5bebbbbdec798516af0a9b721be2e0ee5040d85b8bcd0&w=1480" alt="User Avatar" />
          <div className="texts">
            <span>Ashwin</span>
            <p>Active Chat</p>
          </div>
        </div>
      </div>

      <div className="center">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`messages ${msg.sender === "Gobalu" ? "own" : "other"}`}
          >
            {msg.sender !== "Gobalu" && <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st%3D1726924118~exp%3D1726927718~hmac%3Dbed62af7df07de6219e5bebbbbdec798516af0a9b721be2e0ee5040d85b8bcd0&w=1480" alt="User Avatar" className="avatar" />}
            <div className="texts">
              <p>{msg.text}</p>
              <span>
                {msg.timestamp?.seconds
                  ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()
                  : "Just now"}
              </span>
            </div>
            {msg.sender === "Gobalu" && <img src="./favicon.png" alt="User Avatar" className="avatar" />}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      <div className="bottom">
        <input
          type="text"
          placeholder="Type a message.."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for key down events
        />
        <button className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>

      <div className="emoji">
        <img
          src="./emoji.png"
          alt="Emoji"
          onClick={() => setOpen((prev) => !prev)}
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
