import React, { useContext, useEffect } from "react";
import { Box, List, ListItemButton, ListItemText, Button } from "@mui/material";
import { ChatContext } from "./ChatProvider";

const ChatSessions = () => {
	const { threads, loadThread } = useContext(ChatContext);

	const handleClick = (thread) => {
		// console.log(threads[thread], thread);
		loadThread(thread);
	};
	// const [threadKeys, setThreadKeys] = React.useState(Object.keys(threads));
	useEffect(() => {
		console.log(threads, "updated in chat sessions");
		// setThreadKeys(Object.keys(threads));
	}, [threads]);

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				overflowY: "auto",
				borderRight: "1px solid lightgray",
			}}
		>
			<List>
				<ListItemButton>
					<ListItemText primary="New Chat" sx={{ textAlign: "center" }} />
				</ListItemButton>
				{Object.keys(threads).map((thread, index) => (
					<ListItemButton key={index}>
						<Button
							onClick={() => handleClick(thread)}
							sx={{ width: "100%", margin: 0, padding: 0 }}
						>
							{thread}
						</Button>
					</ListItemButton>
				))}
			</List>
		</Box>
	);
};

export default ChatSessions;
