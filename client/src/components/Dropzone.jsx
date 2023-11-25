import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

function MyDropzone({ setTranscription }) {
  const [dropText, setDropText] = React.useState(
    "Drag and drop your media file here or click to select file"
  );
  const [file, setFile] = React.useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      setFile(file.name);
      axios
        .post("http://localhost:5000/transcribe-media", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => setTranscription(response.data.transcription))
        .catch((error) => console.log(error));
    },
    [setTranscription]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "audio/*, mp4",
  });
  React.useEffect(() => {
    if (isDragActive) {
      setDropText("Drop the files here ...");
    } else {
      setDropText("Drag and drop your media file here or click to select file");
    }
  }, [isDragActive]);

  React.useEffect(() => {
    if (file) {
      setDropText(`Transcribing ${file}...`);
    }
  }, [file]);

  return (
    <Paper
      sx={{
        padding: 2,
        height: 200,
        display: "flex",
        flexDirection: "column", // Center content horizontally and vertically
        justifyContent: "center", // Center content horizontally
        alignItems: "center",
        minHeight: "200px",
        width: { xs: "60%", md: "70%" },
        color: (theme) => theme.palette.text.secondary,
        boxShadow: 10,
        borderRadius: 3,
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon fontSize="large" color="primary" />
      <Typography
        sx={{ display: { xs: "none", md: "flex" } }}
        variant="h5"
        color="textSecondary"
      >
        {dropText}
      </Typography>
      <Typography
        sx={{ display: { xs: "flex", md: "none" } }}
        variant="h5"
        color="textSecondary"
      >
        {dropText ===
        "Drag and drop your media file here or click to select file"
          ? "Drag & drop file here"
          : dropText}
      </Typography>
    </Paper>
  );
}

export default MyDropzone;
