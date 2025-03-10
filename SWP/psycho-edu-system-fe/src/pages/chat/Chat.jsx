import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { Send, InsertEmoticon } from "@mui/icons-material";
import Picker from "emoji-picker-react";
import { motion } from "framer-motion";
import * as signalR from "@microsoft/signalr";
import AuthContext from "../../context/auth/AuthContext";
const Chat = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userData = localStorage.getItem("user");
  const formattedData = JSON.parse(userData);
  const token = formattedData?.accessToken;
  const [isConnected, setIsConnected] = useState(false);
  const connection = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token || !id) {
      console.error("🚨 Missing token or appointmentId");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7192/chatHub?appointmentId=${id}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to ChatHub");
        setIsConnected(true);
      })
      .catch((err) => console.error("Error connecting to SignalR:", err));

    newConnection.on("ReceiveMessage", (sender, message) => {
      setMessages((prevMessages) => [...prevMessages, { sender, message }]);
    });
    newConnection.on("SessionEnded", async (sender, message) => {
      console.log(`${sender}: ${message}`);
      alert("Session has ended.");

      if (connection.current) {
        try {
          await connection.current.stop();
          console.log("SignalR connection closed due to session end.");
          setIsConnected(false);
          navigate(-1);
        } catch (err) {
          console.error("Error disconnecting SignalR:", err);
        }
      }
    });

    connection.current = newConnection;

    return () => {
      if (connection.current) {
        connection.current
          .stop()
          .then(() => console.log("Disconnected from ChatHub"));
      }
    };
  }, [id, token, navigate]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const sendMessage = async () => {
    if (!message.trim()) return;

    if (
      !connection.current ||
      connection.current.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("SignalR not connected. Cannot send message.");
      return;
    }

    try {
      await connection.current.invoke("SendMessage", message);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: formattedData.role, message },
      ]);

      setMessage("");
    } catch (err) {
      console.error("🚨 Error sending message: ", err);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const endSession = async () => {
    if (
      !connection.current ||
      connection.current.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("SignalR not connected. Cannot end session.");
      return;
    }

    try {
      await connection.current.invoke("EndSession", id);
      console.log("Session ended.");
    } catch (err) {
      console.error("🚨 Error ending session:", err);
    }
  };

  return (
    <Paper
      elevation={3}
      className="flex flex-col bg-white shadow-lg"
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box className="bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <Typography variant="h6" className="font-semibold">
          Chat Room
        </Typography>
        <Typography variant="body2">
          {isConnected ? "🟢 Online" : "🔴 Offline"}
        </Typography>
        {(user.role == "Psychologist" || user.role == "Teacher") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={endSession}
            disabled={!isConnected}
          >
            End Session
          </Button>
        )}
      </Box>

      <Box className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isSender = msg.sender === formattedData.role;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <Box
                className={`p-3 rounded-lg max-w-xs ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <Typography variant="body1">{msg.message}</Typography>
              </Box>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </Box>

      <Box className="p-4 bg-gray-100 shadow-md flex items-center gap-2 sticky bottom-0 w-full">
        {/* Nút Emoji */}
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <InsertEmoticon />
        </IconButton>

        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-4 z-10"
          >
            <Picker onEmojiClick={handleEmojiClick} />
          </motion.div>
        )}

        <TextField
          className="flex-1"
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          disabled={!isConnected || message.trim() === ""}
        >
          <Send />
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;
