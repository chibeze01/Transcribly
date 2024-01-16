import React from "react";
import { Button, Box, Grid, TextField } from "@mui/material";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Link = ({ setTranscription }) => {
	const [invalidLink, setInvalidLink] = React.useState(false);
	const [videoLink, setVideoLink] = React.useState("");
	const [target_language, setTargetLanguage] = React.useState("en-US");
	const [loading, setLoading] = React.useState(false);
	const handleChange = (value) => {
		setVideoLink(value);
		if (invalidLink && value == "") setInvalidLink(false);
	};
	const BASEURL = "http://localhost:5000"; //http://trancribly.onrender.com/transcribe-link";
	const handleSubmit = (event) => {
		event.preventDefault();
		const url = event.target[0].value;
		// Regular expression for YouTube video URLs
		const youtubeRegex =
			/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)(&.*)?$/;

		// Test the URL against the regular expression
		if (youtubeRegex.test(url)) {
			setLoading(true);
			// If the URL matches, extract the video ID from the URL
			setVideoLink(url.split("&")[0]);
			const formData = new FormData();
			formData.append("link", videoLink);
			formData.append("target_language", target_language);
			console.log(loading);
			axios
				.post(BASEURL + "/transcribe-link", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					setTranscription(response.data.transcription);
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
			setInvalidLink(false);
		} else {
			// If the URL doesn't match, set an error message
			setInvalidLink(true);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField
				id="Youtube-link"
				variant="outlined"
				placeholder="Enter YouTube link..."
				error={invalidLink}
				helperText={invalidLink && "Please enter a valid YouTube link"}
				sx={{
					width: "100%",
					"& input::placeholder": {
						fontSize: "small",
					},
				}}
				onChange={(event) => handleChange(event.target.value)}
			/>
			<Button
				type="submit"
				variant="outlined"
				color="primary"
				sx={{
					fontSize: { md: "12px", xs: "10px" },
					mt: 1,
				}}
				size="small"
			>
				{loading ? (
					<CircularProgress size={20} sx={{ mr: 1 }} />
				) : (
					"Generate Transcript"
				)}
			</Button>
		</form>
	);
};

export default Link;
