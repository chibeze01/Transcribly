import React from "react";
import { ChatContext } from "./ChatProvider";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = () => {
	const { addMessage } = React.useContext(ChatContext);
	const [input, setInput] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async (e) => {
		setLoading(true);
		addMessage(input);

		// call api to handle message
		const success = true; // addMessage(input);
		// await new Promise((resolve) => setTimeout(resolve, 2000));

		if (success) {
			setInput("");
			setLoading(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			sx={{
				display: "flex",
				flexDirection: "row",
				backgroundColor: "lightblue",
				alignItems: "center",
				padding: "5px",
			}}
		>
			<TextField
				id="chat-input"
				variant="outlined"
				fullWidth
				size="small"
				placeholder="Message Transcribly..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
				sx={{
					backgroundColor: "white",
					borderRadius: 1,
					marginRight: "10px",
					"& input::placeholder": {
						fontSize: "small",
					},
				}}
			/>
			<Button
				type="submit"
				color="primary"
				variant="contained"
				disabled={!input || loading}
			>
				{loading ? (
					<CircularProgress size={20} sx={{ color: "white" }} />
				) : (
					<SendIcon fontSize="small" />
				)}
			</Button>
		</Box>
	);
};

export default ChatInput;
