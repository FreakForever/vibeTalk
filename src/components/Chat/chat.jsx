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
    { id: 1, text: "Hey there! How's your day going?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 2, text: "I just finished reading a great book. Have you read anything interesting lately?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 3, text: "What do you think about the weather today?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 4, text: "Did you catch the game last night?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 5, text: "I'm planning a trip soon. Any recommendations?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 6, text: "What’s your favorite hobby?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 7, text: "I’ve been trying to learn a new language. Any tips?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 8, text: "How do you stay motivated?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 9, text: "What’s your go-to comfort food?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 10, text: "I just watched a fantastic movie. Do you have a favorite film?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 11, text: "What’s something you’ve always wanted to try?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 12, text: "How do you usually spend your weekends?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 13, text: "Have you ever traveled abroad? Where did you go?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 14, text: "What’s your favorite childhood memory?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 15, text: "Are you into any sports? Which ones do you follow?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 16, text: "What music have you been listening to lately?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 17, text: "Do you prefer coffee or tea?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 18, text: "What’s your favorite season of the year?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 19, text: "Have you ever tried meditation? How was your experience?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 20, text: "What’s your biggest pet peeve?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 21, text: "What’s the best advice you’ve ever received?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 22, text: "Do you enjoy cooking? What’s your favorite dish to make?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 23, text: "What’s your favorite way to relax after a long day?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 24, text: "Have you ever participated in a marathon or fun run?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 25, text: "What’s the most interesting place you’ve ever visited?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 26, text: "What kind of books do you enjoy reading?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 27, text: "Do you prefer staying in or going out?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 28, text: "What’s your favorite quote or motto?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 29, text: "How do you handle stress?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 30, text: "What’s a skill you wish you could master?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 31, text: "Are you a morning person or a night owl?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 32, text: "What’s your favorite type of cuisine?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 33, text: "Have you seen any good TV shows lately?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 34, text: "What’s the last thing that made you laugh?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 35, text: "Do you have any pets? Tell me about them!", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 36, text: "What’s your dream job?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 37, text: "How do you like to celebrate your birthday?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 38, text: "What’s the most challenging thing you’ve ever done?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 39, text: "Have you ever been to a concert? Which one was your favorite?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 40, text: "What’s your favorite video game?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 41, text: "What’s one thing you can’t live without?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 42, text: "How do you stay organized in your daily life?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 43, text: "What are you currently binge-watching?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 44, text: "What’s your favorite type of dessert?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 45, text: "Do you believe in aliens?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 46, text: "What’s something you’re really proud of?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 47, text: "How do you like to start your day?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 48, text: "What’s your favorite family tradition?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 49, text: "Do you prefer the city or the countryside?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 50, text: "What’s a movie that always makes you cry?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 51, text: "What’s your favorite social media platform?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 52, text: "Do you have any hidden talents?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 53, text: "What’s your favorite way to exercise?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 54, text: "How do you define success?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 55, text: "What’s your biggest goal for this year?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 56, text: "Have you ever tried a new hobby? What was it?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 57, text: "What’s the best gift you’ve ever received?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 58, text: "Do you prefer reading physical books or e-books?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 59, text: "What’s your favorite memory from school?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 60, text: "What’s your go-to karaoke song?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 61, text: "How do you stay connected with friends and family?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 62, text: "What’s your favorite way to give back to the community?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 63, text: "What’s something you’ve learned this week?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 64, text: "Do you have any travel plans for the future?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 65, text: "What’s your favorite app on your phone?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 66, text: "What’s the most beautiful place you’ve ever seen?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 67, text: "Do you have a favorite restaurant? What do you love about it?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 68, text: "What’s the last concert you attended?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 69, text: "What inspires you to be your best self?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 70, text: "How do you like to unwind after a busy day?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 71, text: "What’s the most adventurous thing you’ve ever done?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 72, text: "Do you have a favorite childhood toy?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 73, text: "What’s your favorite way to celebrate achievements?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 74, text: "What’s one thing on your bucket list?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 75, text: "How do you manage your time effectively?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 76, text: "What’s your favorite sport to play or watch?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 77, text: "Do you have a favorite artist or band?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 78, text: "What’s a memorable trip you’ve taken?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 79, text: "How do you deal with difficult situations?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 80, text: "What’s your favorite thing about your job?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 81, text: "Do you enjoy gardening or working with plants?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 82, text: "What’s your favorite way to connect with nature?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 83, text: "How do you like to express your creativity?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 84, text: "What’s something you wish you could tell your younger self?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 85, text: "What’s the last thing you learned that surprised you?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 86, text: "Do you have a favorite documentary? What is it about?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 87, text: "What’s your favorite kind of pizza topping?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 88, text: "How do you celebrate special occasions?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 89, text: "What’s your go-to snack?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 90, text: "What’s a trend you’ve noticed lately?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 91, text: "How do you prioritize your tasks?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 92, text: "What’s your favorite way to stay active?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 93, text: "Do you have a favorite podcast?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 94, text: "What’s something you’re looking forward to this month?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 95, text: "How do you stay informed about current events?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 96, text: "What’s your favorite family recipe?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 97, text: "Do you have a favorite childhood book?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 98, text: "What’s your dream vacation destination?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
    { id: 99, text: "How do you stay positive during tough times?", sender: "User1", timestamp: { seconds: Date.now() / 1000 } },
    { id: 100, text: "What’s the most important lesson you’ve learned in life?", sender: "User2", timestamp: { seconds: Date.now() / 1000 } },
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
