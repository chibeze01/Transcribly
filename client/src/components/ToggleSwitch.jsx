import React from "react";
import Switch from "@mui/material/Switch";
import { AudioFile, Link } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";

const IOSSwitch2 = styled(({ className, ...other }) => (
  <Switch
    className={className}
    icon={<AudioFile fontSize="xs" />} // Use AudioFile icon for 'off' state
    checkedIcon={<Link fontSize="xs" />} // Use Link icon for 'on' state
    {...other}
  />
))(({ theme }) => ({
  width: 42,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "600ms",
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#FF0000",
        opacity: 1,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#65C466",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 1000,
    }),
  },
}));

const ToggleSwitch = (props) => {
  return (
    <Container
      sx={{
        width: { xs: "71%", md: "77%" },
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "5px",
      }}
    >
      <IOSSwitch2
        sx={{ borderRadius: 14, boxShadow: 3 }}
        checked={props.checked}
        onChange={props.onChange}
      />
    </Container>
  );
};

export default ToggleSwitch;
