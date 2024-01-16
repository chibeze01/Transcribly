import React from "react";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const ChatContext = createContext();
export const user = {
	name: "John Doe",
	avatar: "https://example.com/john.jpg",
	Threads: {
		idx: [
			{ text: "this is a message", author: "John Doe" },
			{ text: "this is another message", author: "bot" },
			{ text: "this is a message", author: "John Doe" },
		],
		idx2: [
			{ text: "this is a message", author: "bot" },
			{ text: "this is another message", author: "John Doe" },
			{ text: "this is a message", author: "bot" },
		],
	},
};

const ChatProvider = ({ children }) => {
	const [messages, setMessages] = useState([]);
	// () => {
	// const localData = localStorage.getItem("threads");
	// return localData ? JSON.parse(localData) : {};
	// }

	const [threads, setThreads] = useState(user.Threads);
	const [currentThreadId, setCurrentThread] = useState(null);

	// Effect for handling changes to currentThreadId
	useEffect(() => {
		if (currentThreadId) {
			console.log(
				threads[currentThreadId],
				"call inside effect in chat provider",
				threads,
				currentThreadId
			);
			setMessages(threads[currentThreadId]);
		}
	}, [currentThreadId, threads]);

	// // Effect for storing threads in local storage
	// useEffect(() => {
	// 	localStorage.setItem("threads", JSON.stringify(threads));
	// }, [threads]);

	const addMessage = (msgText) => {
		const newMessage = { text: msgText, author: user.name };
		if (currentThreadId) {
			setThreads((prevThreads) => ({
				...prevThreads,
				[currentThreadId]: [newMessage, ...prevThreads[currentThreadId]],
			}));
		} else {
			const threadId = uuidv4();
			setCurrentThread(threadId);
			setThreads((prevThreads) => ({
				[threadId]: [newMessage],
				...prevThreads,
			}));
		}
	};

	const loadThread = (thread) => {
		if (thread !== currentThreadId) {
			setCurrentThread(thread);
			console.log(threads[thread], "load thread");
		}
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				threads,
				addMessage,
				loadThread,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
