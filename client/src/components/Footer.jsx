import React from "react";
import { Container, Typography, Link, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GitHub, LinkedIn, Copyright } from "@mui/icons-material";

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#000000",
  textDecoration: "none",
  "&:hover": {
    color: "#65C466",
  },
}));
// ensure that the footer is always at the bottom of the page
const Footer = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "5rem",
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body1">
        Made with ❤️ by <StyledLink href="google.com">Transcribly </StyledLink>
        {<Copyright sx={{ fontSize: "1rem" }} />} 2023
      </Typography>
      <Stack direction="row" spacing={"10px"}>
        <Link href={"https://linkedin.com/in/chibeze-nwangwu"}>
          <LinkedIn />
        </Link>
        <Link href={"https://github.com/chibeze01/"} sx={{ color: "#000000" }}>
          <GitHub />
        </Link>
      </Stack>
    </Container>
  );
};

export default Footer;
