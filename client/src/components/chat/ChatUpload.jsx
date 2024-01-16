import Dropzone from "../Dropzone";
import ToggleSwitch from "../ToggleSwitch";
import Link from "../Link";
import { Box } from "@mui/material";
import { ChatContext } from "./ChatProvider";
import { useContext, useState } from "react";

const ChatUpload = () => {
	const [isToggle, setToggle] = useState(false);
	const { addMessage } = useContext(ChatContext);
	return (
		<Box
			id="upload"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				mr: 1,
			}}
		>
			<ToggleSwitch checked={isToggle} onChange={() => setToggle(!isToggle)} />
			{!isToggle ? (
				<Dropzone setTranscription={addMessage} />
			) : (
				<Link setTranscription={addMessage} />
			)}
		</Box>
	);
};

export default ChatUpload;
