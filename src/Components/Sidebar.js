import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import copy from "clipboard-copy";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { CopyAll } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import customer from "../assets/images/icons/customer.png";
import menu from "../assets/images/icons/menu.png";
import logo1 from "../assets/images/logo/logo.png";
import { apiConnectorGet } from "../services/apiconnector";
import { domain, endpoint } from "../services/urls";

const drawerWidth = 280;

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie =
        c.trim().split("=")[0] +
        "=;expires=" +
        new Date(0).toUTCString() +
        ";path=/";
    });

    window.location.href = "/";
    window.location.reload();
  };


  const { data } = useQuery(
    ["dashboard"],
    () => apiConnectorGet(endpoint?.member_details),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
  const user = data?.data?.result[0] || [];

  const navigate = useNavigate();
  const profileclick = () => {
    navigate("/profile");
  };

  const functionTOCopy = (value) => {
    copy(value);
    toast("Copied to clipboard!", { id: 1 });
  };
  return (
    <>
      <style>
        {`
                    .css-61kcu5 .MuiDrawer-paper {
                        background: #1d1b1b !important;
                    }
                `}
      </style>
      {/* Menu Button */}

      <Box className="main_header">
        <IconButton onClick={handleToggle} sx={{ zIndex: 100 }}>
          <Box component="img" src={menu} sx={{ filter: "hue-rotate(45deg)" }} alt="menu"></Box>
        </IconButton>
        <Box
          component="img"
          src={logo1}
          sx={{ width: "40px", cursor: "pointer" }}
          onClick={() => window.location.reload()}
        />

        <ListItemButton component={Link} to="/Dashboard">
          <Box
            component="img"
            src={customer}
            alt="customer"
            sx={{ cursor: "pointer" ,  filter: "hue-rotate(45deg)"}}
            onClick={() => window.open("https://t.me/AiMetaTrade", "_blank")}
          ></Box>
        </ListItemButton>
      </Box>

      {/* Sidebar Drawer */}
      <Drawer
        className="sidebar_main"
        anchor="left"
        open={open}
        onClose={handleToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        <Box className="sidebar_details">
          <Box className="main_logo">
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <Box
                sx={{ width: "100%", height: "100%" }}
                component="img"
                src={domain + user?.lng_profile}
                alt="user"
                onClick={profileclick}
              ></Box>
              <Box>
                <Typography variant="h6">
                  {String(user?.lgn_name)?.substring(0, 10) + "..." || ""}
                </Typography>
                <Box sx={{ display: "flex", gap: "14px" }}>
                  {" "}
                  <Typography>
                    UID: <span>{user?.lgn_cust_id}</span>{" "}
                  </Typography>
                  {/* <Typography>
                  Rank: <span>{user?.rank_name}</span>
                </Typography> */}
                  <CopyAll sx={{ color: "#aaa !important" }}
                    fontSize="small"
                    onClick={() => {
                      user?.lgn_cust_id && functionTOCopy(user?.lgn_cust_id);
                    }}
                  />
                </Box>
              </Box>
            </div>

            <div
              style={{
                marginRight: "5px",
              }}
            >
              <p>Rank:</p>
              <p style={{ color: "green !important" }}>
                {user?.rank_name || "--"}
              </p>
            </div>
          </Box>
          {/* <Box className="varfication_box">
            <Box>
              <Typography variant="h6">Basic Verification</Typography>
              <Typography>Authenticated</Typography>
            </Box>
            <i class="ri-map-pin-user-line"></i>
          </Box> */}
          <Box className="varfication_box varfication_box-2">
            <Box>
              <Typography variant="h6"> Verification</Typography>
              <Typography>Not Certified</Typography>
            </Box>
            <i class="ri-map-pin-user-line"></i>
          </Box>
        </Box>
        <List>
          <ListItem>
            <ListItemButton component={Link} to="/profile">
              <ListItemText>User Information</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              to="/AssetsPage"
              onClick={() => {
                localStorage.setItem("lastlab", 3);
              }}
            >
              <ListItemText primary="Transaction History" />
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={Link} to="/promotional">
              <ListItemText>Invite Friends</ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={Link} to="/official">
              <ListItemText> Official Channel </ListItemText>
            </ListItemButton>
          </ListItem>
          {/* <ListItem>
            <ListItemButton component={Link} to="/soon">
              <ListItemText>Task </ListItemText>
            </ListItemButton>
          </ListItem> */}
          {/* <ListItem>
            <ListItemButton
              // component={Link}
              onClick={() => {
                localStorage.setItem("lastlab", 3);
                navigate("/AssetsPage");
              }}
            >
              <ListItemText>Earn </ListItemText>
            </ListItemButton>
          </ListItem> */}

          {/* <ListItem>
            <ListItemButton component={Link} to="/Help">
              <ListItemText>FAQ</ListItemText>
            </ListItemButton>
          </ListItem> */}
          {/* <ListItem>
            <ListItemButton component={Link} to="/About">
              <ListItemText>About IFC Trade</ListItemText>
            </ListItemButton>
          </ListItem> */}
          <ListItem>
            <ListItemButton component={Link} to="/security">
              <ListItemText>Security</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} onClick={() => (window.location.href = "/download")}>
              <ListItemText>Download App</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              component={Link}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ color: "#a5a5a5 !important" }}>
                Language
              </Typography>
              <Typography sx={{ color: "#a5a5a5 !important " }}>
                English
              </Typography>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              component={Link}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ color: "#a5a5a5 !important" }}>
                Quote Currency
              </Typography>
              <Typography sx={{ color: "#a5a5a5 !important" }}>
                USDT - $
              </Typography>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate('/', { replace: true });
                window.location.reload();
              }}
            >
              <ListItemText
                sx={{
                  color: "red",
                }}
                primary="Logout"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
