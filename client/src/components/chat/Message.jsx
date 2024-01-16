import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { user } from "./ChatProvider";

const Message = ({ message }) => {
	function stringAvatar(name) {
		// console.log(name);
		if (typeof name === "string") {
			if (name === "bot") {
				return {
					children: "TS",
				};
			} else {
				if (name.split(" ").length === 1) {
					return {
						children: `${name[0]}`,
					};
				}
				return {
					children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
				};
			}
		} else {
			return {
				children: "NA",
			};
		}
	}
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: message.author === user.name ? "row-reverse" : "row",
				alignItems: "flex-start",
				marginY: "10px",
				maxWidth: "70%",
				alignSelf: message.author === user.name ? "flex-end" : "flex-start",
			}}
		>
			<Avatar
				{...stringAvatar(message.author)}
				sx={{ mr: 1, ml: 1, fontSize: 12 }}
			/>
			<Box
				sx={{
					padding: "8px",
					borderRadius: "12px",
					backgroundColor: message.author === user.name ? "#0b93f6" : "#f3f3f3",
					color: message.author === user.name ? "#ffffff" : "#000000",
				}}
			>
				<Typography variant="body1" fontSize={12}>
					{message.text}
				</Typography>
			</Box>
		</Box>
	);
};

export default Message;
