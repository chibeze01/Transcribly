import React from "react";
import { Box, Typography, Divider, Grid, Icon } from "@mui/material";
import { styled } from "@mui/material/styles";

const ContentCopy = styled(({ className, ...props }) => (
  <Icon
    className={className}
    onClick={() => navigator.clipboard.writeText(props.transcription)}
  >
    content_copy
  </Icon>
))(() => ({
  color: "black", // Default color
  "&:hover": {
    color: "blue", // Color on hover
  },
  "&:active": {
    color: "green", // Color on click
  },
}));

const Transcription = ({ transcription, ...props }) => {
  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column", // Center content horizontally and vertically
        alignContent: "center", // Center content horizontally
        width: { xs: "60%", md: "70%" },
        marginTop: 4,
        boxShadow: 5,
        borderRadius: 3,
      }}
    >
      <Divider variant="large" />
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography
            gutterBottom
            variant="h6"
            sx={{ display: "flex", alignContent: "flex-start" }}
          >
            Transcription
          </Typography>
        </Grid>
        <Grid item>
          <ContentCopy transcription={transcription} />
        </Grid>
      </Grid>
      <Typography variant="body">{transcription}</Typography>
    </Box>
  );
};

export default Transcription;
