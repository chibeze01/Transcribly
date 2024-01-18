import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { Box, Typography } from "@mui/material";

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
    <Box
      className="dropzone"
      sx={{
        padding: 2,
        height: 100,
        display: "flex",
        flexDirection: "column", // Center content horizontally and vertically
        justifyContent: "center", // Center content horizontally
        alignItems: "center",
        minHeight: "100px",
        color: (theme) => theme.palette.text.secondary,
        boxShadow: 1,
        borderRadius: 3,
        cursor: "pointer",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon fontSize="medium" color="primary" />
      <Typography
        sx={{ display: { xs: "none", md: "flex" } }}
        variant="h5"
        color="textSecondary"
        fontSize="medium"
      >
        {dropText}
      </Typography>
      <Typography
        sx={{ display: { xs: "flex", md: "none" } }}
        variant="h5"
        color="textSecondary"
        fontSize="small"
      >
        {dropText ===
        "Drag and drop your media file here or click to select file"
          ? "Drag & drop file here"
          : dropText}
      </Typography>
    </Box>
  );
}

export default MyDropzone;
