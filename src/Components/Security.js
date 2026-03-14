import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmailIcon from "@mui/icons-material/Email";
import SecurityIcon from "@mui/icons-material/Security";
import Header2 from "./Layouts/Header2";
import { useQuery } from "react-query";
import { endpoint } from "../services/urls";
import { apiConnectorGet } from "../services/apiconnector";
import { useNavigate } from "react-router-dom";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
export default function Security() {
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

  return (
    <>
      <Header2 title="Security" />
      <Box
        sx={{
          minHeight: "100vh",
          color: "#fff",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Phone Card */}
          <Card
            sx={{
              flex: 1,
              background: "linear-gradient(145deg,#1a1a1a,#0f0f0f)",
              color: "#fff",
              borderRadius: 4,
              boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.9)",
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: 3,
                paddingY: "10px",
                backgroundColor: "black !important",
              }}
            >
              <Box
                style={{
                  paddingBottom: "4px !important",
                }}
                paddingBottom={0}
                // MuiCardContent-root css-10da543-MuiCardContent-root:""
              >
                <PhoneIphoneIcon
                  sx={{ mb: "3px", fontSize: 28, color: "#00e5ff" }}
                />

                <Typography variant="subtitle1" fontWeight={600}>
                  Phone
                </Typography>

                <Typography
                  sx={{
                    color: "#bbb",
                    fontSize: "13px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user?.lgn_mobile}
                </Typography>
              </Box>

              <ErrorOutlineIcon
                sx={{
                  color: "#ffa726",
                  fontSize: 26,
                  opacity: 0.9,
                }}
              />
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card
            sx={{
              flex: 1,
              background: "linear-gradient(145deg,#1a1a1a,#0f0f0f)",
              color: "#fff",
              borderRadius: 4,
              boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.9)",
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: 3,
                paddingY: "10px",
                backgroundColor: "black !important",
              }}
            >
              <Box
                style={{
                  paddingBottom: "4px !important",
                }}
                paddingBottom={0}
                // MuiCardContent-root css-10da543-MuiCardContent-root:""
              >
                <EmailIcon sx={{ mb: "3px", fontSize: 28, color: "#00e5ff" }} />

                <Typography variant="subtitle1" fontWeight={600}>
                  Email
                </Typography>

                <Typography
                  sx={{
                    color: "#bbb",
                    fontSize: "13px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user?.lgn_email}
                </Typography>
              </Box>

              <CheckCircleIcon sx={{ color: "limegreen" }} />
            </CardContent>
          </Card>
          {/* {user?.lgn_wallet_add && (
            <Card
              sx={{
                flex: 1,
                background: "linear-gradient(145deg,#1a1a1a,#0f0f0f)",
                color: "#fff",
                borderRadius: 4,
                boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.9)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 3,
                  paddingY: "10px",
                  backgroundColor: "black !important",
                }}
              >
                <Box
                  style={{
                    paddingBottom: "4px !important",
                  }}
                  paddingBottom={0}
                >
                  <AccountBalanceWalletIcon
                    sx={{ mb: "3px", fontSize: 28, color: "#00e5ff" }}
                  />

                  <Typography variant="subtitle1" fontWeight={600}>
                    Wallet Address(BEP20)
                  </Typography>

                  <Typography
                    sx={{
                      color: "#bbb",
                      fontSize: "13px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {String(user?.lgn_wallet_add)?.substring(0, 15) +
                      "..." +
                      String(user?.lgn_wallet_add)?.substring(
                        user?.lgn_wallet_add?.length - 10,
                        user?.lgn_wallet_add,
                      )}
                  </Typography>
                </Box>

                <ArrowCircleRightIcon sx={{ color: "limegreen" }} />
              </CardContent>
            </Card>
          )} */}
        </Box>

        {/* Settings List */}
        <Box sx={{ mt: 4 }}>
          {["Login Password", "Bind Withdrawal Address", "Bind 2FA"].map(
            (item, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                  }}
                  onClick={() => {
                    if (item === "Login Password") {
                      navigate("/change_password");
                    } else if (item === "Bind Withdrawal Address") {
                      navigate("/update-wallet-address");
                    }
                  }}
                >
                  <Typography>{item}</Typography>

                  {item === "Login Password" ? (
                    <Box
                      //   onClick={() => navigate("/change_password")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <Typography sx={{ color: "#aaa" }}>Reset</Typography>
                      <ArrowForwardIosIcon
                        sx={{ fontSize: 14, color: "#888" }}
                      />
                    </Box>
                  ) : item === "Fund Password" ||
                    item === "Withdrawal Whitelist" ? (
                    <Typography sx={{ color: "#aaa" }}>Settings</Typography>
                  ) : (
                    <ArrowForwardIosIcon sx={{ fontSize: 16, color: "#888" }} />
                  )}
                </Box>
                <Divider sx={{ bgcolor: "#222" }} />
              </Box>
            ),
          )}

          <Divider sx={{ bgcolor: "#222" }} />
        </Box>
      </Box>
    </>
  );
}
