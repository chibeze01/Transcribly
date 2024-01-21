import React from "react";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const ChatContext = createContext();
export const user = {
  name: "John Doe",
  avatar: "https://example.com/john.jpg",
  Threads: {
    idx: {
      title: "messages",
      chat: [
        { text: "this is a message", author: "John Doe" },
        { text: "this is another message", author: "bot" },
        { text: "this is a message", author: "John Doe" },
      ],
    },
    idx2: {
      title: "another messages",
      chat: [
        { text: "this is a message", author: "bot" },
        { text: "this is another message", author: "John Doe" },
        { text: "this is a message", author: "bot" },
      ],
    },
  },
};

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [threads, setThreads] = useState(user.Threads);
  const [currentThreadId, setCurrentThread] = useState(null);

  // Effect for handling changes to currentThreadId
  useEffect(() => {
    if (currentThreadId) {
      setMessages(threads[currentThreadId].chat);
    }
  }, [threads, currentThreadId]);

  const addMessage = (msgText, botSender = false) => {
    const newMessage = { text: msgText, author: botSender ? "bot" : user.name };
    if (currentThreadId) {
      setThreads((prevThreads) => ({
        ...prevThreads,
        [currentThreadId]: {
          ...prevThreads[currentThreadId],
          chat: [newMessage, ...prevThreads[currentThreadId].chat],
        },
      }));
    } else {
      const threadId = uuidv4();
      setCurrentThread(threadId);
      setThreads((prevThreads) => ({
        [threadId]: { title: "New Chat", chat: [newMessage] },
        ...prevThreads,
      }));
    }
  };

  const newChat = () => {
    setMessages([]);
    setCurrentThread(null);
  };

  const loadThread = (thread) => {
    if (thread !== currentThreadId) {
      setCurrentThread(thread);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        threads,
        loading,
        addMessage,
        loadThread,
        newChat,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
