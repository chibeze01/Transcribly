import React from "react";
import ChatProvider from "./ChatProvider";
import { Grid, Toolbar } from "@mui/material";
import ChatUpload from "./ChatUpload";
import ChatInput from "./ChatInput";
import ChatStream from "./ChatStream";
import ChatSessions from "./ChatSessions";

const ChatInterface = () => {
  return (
    <ChatProvider>
      <Toolbar sx={{ marginBottom: "8px" }} />
      <Grid container spacing={2}>
        <Grid item xs={2} sx={{ borderRight: "1px solid lightgray" }}>
          <ChatSessions />
        </Grid>
        <Grid item xs={7}>
          <ChatStream />
          <ChatInput />
        </Grid>
        <Grid item xs={3} sx={{ borderLeft: "1px solid lightgray" }}>
          <ChatUpload />
        </Grid>
      </Grid>
    </ChatProvider>
  );
};

export default ChatInterface;
