import React from "react";
import Dropzone from "./Dropzone";
import ToggleSwitch from "./ToggleSwitch";
import Link from "./Link";
import { Container } from "@mui/material";
import Transcription from "./Transcription";

const UploadFile = () => {
  const [isToggle, setToggle] = React.useState(false);
  const [transcription, setTranscription] = React.useState("");
  return (
    <Container
      id="upload"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <ToggleSwitch checked={isToggle} onChange={() => setToggle(!isToggle)} />
      {!isToggle ? (
        <Dropzone setTranscription={setTranscription} />
      ) : (
        <Link setTranscription={setTranscription} />
      )}
      {transcription && <Transcription transcription={transcription} />}
    </Container>
  );
};

export default UploadFile;
