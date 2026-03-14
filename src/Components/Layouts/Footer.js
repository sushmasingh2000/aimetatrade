import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Container,
} from "@mui/material";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const comingSoon = () => {
    toast("🚀 Will be live soon", { id: 1 });
  };
  const sooncomingSoon = () => {
    toast("🚀 Will be live soon", { id: 1 });
  };


  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0f0f1a",
        borderTop: "1px solid #1e1e2f",
        zIndex: 1000,
      }}
    >
      <Container sx={{ p: "0 !important" }}>
        <List
          className="footer_main"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Home */}
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/Dashboard"
              sx={navStyle}
            >
              <Box>
                <i className="ri-home-4-line"></i>
              </Box>
              <ListItemText
                primary={<Typography variant="caption">Home</Typography>}
              />
            </ListItemButton>
          </ListItem>

          {/* Markets */}
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/markets"
              sx={navStyle}
            >
              <Box>
                <i className="ri-bar-chart-box-ai-line"></i>
              </Box>
              <ListItemText
                primary={<Typography variant="caption">Markets</Typography>}
              />
            </ListItemButton>
          </ListItem>

          {/* Trade */}
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/futures/BTCUSDT"
              sx={navStyle}
            >
              <Box className="trade_icon">
                <i className="ri-pie-chart-line"></i>
              </Box>
              <ListItemText
                primary={<Typography variant="caption">Trade</Typography>}
              />
            </ListItemButton>
          </ListItem>

          {/* Promotion */}
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/promotional"
              sx={navStyle}
            >
              <Box>
                <i className="ri-team-line"></i>
              </Box>
              <ListItemText
                primary={<Typography variant="caption">Promotion</Typography>}
              />
            </ListItemButton>
          </ListItem>

          {/* Assets */}
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/AssetsPage"
              sx={navStyle}
            >
              <Box>
                <i className="ri-wallet-3-line"></i>
              </Box>
              <ListItemText
                primary={<Typography variant="caption">Assets</Typography>}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Container>
    </Box>
  );
}

const navStyle = {
  flexDirection: "column",
  textAlign: "center",
  color: "#cfd8ff",
  minWidth: "auto",

  "& i": {
    fontSize: 22,
    marginBottom: "2px",
    color: "#cfd8ff",
    transition: "0.3s",
  },

  /* Remove hover background */
  "&:hover": {
    backgroundColor: "transparent",
  },

  /* Remove active click background */
  "&.Mui-selected": {
    backgroundColor: "transparent",
  },

  "&.active": {
    color: "#9f41ec",
    backgroundColor: "transparent",   // ✅ no background
  },

  "&.active i": {
    color: "#9f41ec",
  },
};

