import React, { useContext, useEffect } from "react";
import {
	Box,
	List,
	ListItemButton,
	ListItemText,
	Button,
	ListItemIcon,
} from "@mui/material";
import { ChatContext } from "./ChatProvider";
import { AddComment } from "@mui/icons-material";
const ChatSessions = () => {
	const { threads, loadThread, newChat } = useContext(ChatContext);

	const handleClick = (thread) => {
		loadThread(thread);
	};
	const handelNewChat = () => {
		newChat();
	};

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				overflowY: "auto",
			}}
		>
			<List>
				<ListItemButton sx={{ display: "flex", justifyContent: "center" }}>
					<AddComment onClick={() => handelNewChat()} />
				</ListItemButton>
				{Object.keys(threads).map((thread, index) => (
					<ListItemButton key={index}>
						<Button
							onClick={() => handleClick(thread)}
							sx={{ width: "100%", margin: 0, padding: 0 }}
						>
							{threads[thread].title}
						</Button>
					</ListItemButton>
				))}
			</List>
		</Box>
	);
};

export default ChatSessions;
