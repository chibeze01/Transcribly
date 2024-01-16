import React from "react";
import ChatProvider from "./ChatProvider";
import { Grid, Box, Toolbar } from "@mui/material";
import ChatUpload from "./ChatUpload";
import ChatInput from "./ChatInput";
import ChatStream from "./ChatStream";
import ChatSessions from "./ChatSessions";

const ChatInterface = () => {
	return (
		<div>
			<Toolbar sx={{ marginBottom: "8px" }} />
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<ChatProvider>
						<ChatSessions />
					</ChatProvider>
				</Grid>
				<Grid item xs={6}>
					<ChatProvider>
						<ChatStream />
						<ChatInput />
					</ChatProvider>
				</Grid>
				<Grid item xs={3}>
					<ChatProvider>
						<ChatUpload />
					</ChatProvider>
				</Grid>
			</Grid>
		</div>
	);
};

export default ChatInterface;
