import React, { useEffect } from "react";
import { ChatContext } from "./ChatProvider";
import { Box } from "@mui/material";
import Message from "./Message";

const ChatStream = () => {
	const { messages } = React.useContext(ChatContext);

	return (
		<Box
			sx={{
				height: "87vh",
				// backgroundColor: "gray-white",
				overflowY: "auto",
				display: "flex",
				flexDirection: "column-reverse",
			}}
		>
			{Array.isArray(messages) && messages.length > 0 ? (
				messages.map((message, index) => (
					<Message key={index} message={message} />
				))
			) : (
				<p>New chat upload a file to start</p>
			)}
		</Box>
	);
};

export default ChatStream;
