import React from "react";
import ChatProvider from "./ChatProvider";
import { Grid, Box, Toolbar } from "@mui/material";
import ChatUpload from "./ChatUpload";
import ChatInput from "./ChatInput";
import ChatStream from "./ChatStream";
import ChatSessions from "./ChatSessions";

const ChatInterface = () => {
	return (
		<ChatProvider>
			<Toolbar sx={{ marginBottom: "8px" }} />
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<ChatSessions />
				</Grid>
				<Grid item xs={6}>
					<ChatStream />
					<ChatInput />
				</Grid>
				<Grid item xs={3}>
					<ChatUpload />
				</Grid>
			</Grid>
		</ChatProvider>
	);
};

export default ChatInterface;
