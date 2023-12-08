import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axios from "axios";
import { Grid } from "@mui/material";

const Link = ({ setTranscription }) => {
  const [invalidLink, setInvalidLink] = React.useState(false);
  const [videoLink, setVideoLink] = React.useState("");
  const BASEURL = "http://trancribly.onrender.com/transcribe-link";
  const handleSubmit = (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    // Regular expression for YouTube video URLs
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)(&.*)?$/;

    // Test the URL against the regular expression
    if (youtubeRegex.test(url)) {
      // If the URL matches, extract the video ID from the URL
      setVideoLink(url.split("&")[0]);
      const formData = new FormData();
      formData.append("link", videoLink);
      axios
        .post(BASEURL + "/transcribe-link", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => setTranscription(response.data.transcription))
        .catch((error) => console.log(error));
      setInvalidLink(false);
    } else {
      // If the URL doesn't match, set an error message
      setInvalidLink(true);
    }
  };

  return (
    <Paper
      sx={{
        padding: 2,
        height: 50,
        minHeight: "50px",
        width: { xs: "60%", md: "70%" },
        borderRadius: 3,
        boxShadow: 10,
        color: (theme) => theme.palette.text.secondary,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container alignItems={"center"} spacing={2}>
          <Grid item xs>
            <TextField
              id="youtube_Link"
              label="Input Youtube video link"
              variant="outlined"
              error={invalidLink}
              helperText={invalidLink ? "Enter a valid youtube link" : ""}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Generate Transcript
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Link;
