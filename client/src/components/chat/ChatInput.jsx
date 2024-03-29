import React from "react";
import { ChatContext } from "./ChatProvider";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = () => {
  const { addMessage, loading, setLoading } = React.useContext(ChatContext);
  const [input, setInput] = React.useState("");

  const handleSubmit = async (e) => {
    setLoading(true);
    addMessage(input);

    // maybe we call api to handle message handled in the sessions
    const success = true;

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
        // backgroundColor: "lightblue",
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
        autoComplete="off"
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
