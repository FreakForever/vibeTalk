import { useEffect, useRef, useState } from "react";

const Chat = ({ user, messages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref to the end of the messages

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage); // Call the sendMessage function passed from App.js
      setNewMessage(""); // Clear input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (e.g., form submission)
      handleSend(); // Call handleSend on Enter key press
    }
  };

  // Scroll to the bottom of the messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      <div className="center">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.uid === user.uid ? "own" : "other"}`}
          >
            <div className="texts">
              <p className="senderName">{msg.displayName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {/* Empty div to scroll to */}
        <div ref={messagesEndRef} /> 
      </div>
      <div className="bottom">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={handleKeyPress} // Add the key press event listener here
        />
        <button onClick={handleSend} className="sendButton">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
