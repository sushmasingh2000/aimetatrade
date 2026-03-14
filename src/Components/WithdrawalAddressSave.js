import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowLeft, ClosedEye, EyeO } from "@react-vant/icons";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import Header2 from "./Layouts/Header2";
import SvgIcons from "../SvgIcons";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import { useQuery, useQueryClient } from "react-query";

const WithdrawalAddressSave = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloding] = useState(false);
  const [step, setStep] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const client = useQueryClient();
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

  const formik = useFormik({
    initialValues: {
      wallet_addresss: user?.lgn_wallet_add || "",
    },
    enableReinitialize: true,

    onSubmit: async () => {
      emailOtp();
    },
  });

  const emailOtp = async () => {
    try {
      const res = await apiConnectorPost(endpoint?.send_otp, {
        useremail: user?.lgn_email,
        type: "walletaddress",
      });
      toast(res?.data?.message, { id: 1 });
      if (res?.data?.success) {
        setStep(true);
      }
    } catch (e) {
      console.log("error");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await apiConnectorPost(endpoint?.verify_otp, {
        useremail: user?.lgn_email,
        otp: otp.join(""),
      });
      if (res?.data?.success) {
        setWithdrawalAddress();
      } else {
        toast(res?.data?.message);
      }
    } catch (e) {
      console.log("error");
    }
  };

  const navigate = useNavigate();

  async function setWithdrawalAddress() {
    {
      setloding(true);
      try {
        const reqbody = {
          wallet_address: formik.values.wallet_addresss,
        };

        const res = await apiConnectorPost(endpoint.change_wallet, reqbody);
        toast(res?.data?.message);
        setloding(false);
        if (res?.data?.success) {
          navigate("/security");
          client.refetchQueries("dashboard");
        }
      } catch (error) {
        toast.error("Something went wrong");
        setloding(false);
      }
    }
  }
  return (
    <>
      <Header2 title="Bind Withdrawal Address" />
      <SvgIcons />
      <CustomCircularProgress isLoading={loading} />
      <Container
        sx={{
          ...style.container,
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(14px)",
        }}
      >
        {/* FORM */}
        <Box m={3} className="!mt-16">
          <form onSubmit={formik.handleSubmit}>
            {/* OLD PASSWORD */}
            {!user?.lgn_wallet_add ? (
              <PasswordField
                label="Enter USDT BEP20 Wallet Address"
                name="wallet_addresss"
                value={formik.values.wallet_addresss}
                onChange={formik.handleChange}
                showPassword={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            ) : (
              <PasswordField
                label="Enter USDT BEP20 Wallet Address"
                name="wallet_addresss"
                value={formik.values.wallet_addresss}
                showPassword={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            )}

            {!user?.lgn_wallet_add && formik.values.wallet_addresss && (
              <Button
                type="submit"
                disabled={step}
                sx={{
                  ...style.mainwallettrbutton,
                  "&.Mui-disabled": {
                    filter: "blur(1px)", // blur effect
                    opacity: 0.6, // faded look
                    color: "white",
                  },
                }}
                className="roboto !mt-8"
                style={{
                  fontWeight: 700,
                }}
              >
                Send OTP
              </Button>
            )}

            {!user?.lgn_wallet_add && (
              <>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <svg
                      style={{ marginRight: "10px" }}
                      className="svg-icon"
                      width="25"
                      height="25"
                      fill={"#ad49ff"}
                    >
                      <use xlinkHref="#icon-email"></use>
                    </svg>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#e3efff",
                      }}
                    >
                      OTP
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#e3efff",
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    Enter the 6-digit code sent to your email. OTP is valid for
                    5 minutes.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        placeholder="*"
                        value={digit}
                        id={`otp-${index}`}
                        type="text"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (!val) return;
                          const newOtp = [...otp];
                          newOtp[index] = val[0];
                          setOtp(newOtp);

                          if (index < 5) {
                            setTimeout(() => {
                              document
                                .getElementById(`otp-${index + 1}`)
                                ?.focus();
                            }, 0);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            e.preventDefault();
                            const newOtp = [...otp];
                            if (newOtp[index]) {
                              newOtp[index] = "";
                              setOtp(newOtp);
                            } else if (index > 0) {
                              newOtp[index - 1] = "";
                              setOtp(newOtp);
                              document
                                .getElementById(`otp-${index - 1}`)
                                ?.focus();
                            }
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasteData = e.clipboardData
                            .getData("text")
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          if (!pasteData) return;
                          const newOtp = [...otp];
                          for (let i = 0; i < pasteData.length; i++) {
                            newOtp[i] = pasteData[i];
                          }
                          setOtp(newOtp);

                          const nextIndex = Math.min(pasteData.length, 5);
                          setTimeout(() => {
                            document
                              .getElementById(`otp-${nextIndex}`)
                              ?.focus();
                          }, 0);
                        }}
                        inputProps={{
                          maxLength: 1,
                          style: {
                            textAlign: "center",
                            fontSize: "20px",
                            width: "25px",
                            height: "25px",
                            backgroundColor: "white",
                            color: "black",
                            borderRadius: "8px",
                          },
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Button
                  onClick={verifyOtp}
                  sx={{
                    padding: "6px",
                    width: "100%",
                    background: "linear-gradient(90deg, #ad49ff, #7d18d2)",
                    color: "#fff",
                    borderRadius: "20px",
                    mb: 2,
                    fontSize: "19px",
                    mt: 5,
                    fontWeight: "700",
                    "&:hover": {
                      background: "linear-gradient(90deg, #ad49ff, #7d18d2)",
                    },
                  }}
                >
                  Verify & Save
                </Button>
              </>
            )}
          </form>
        </Box>
      </Container>
    </>
  );
};

export default WithdrawalAddressSave;

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  toggle,
}) => (
  <Box mt={2}>
    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
      <svg width="20" height="20" fill="#7d18d2">
        <use xlinkHref="#icon-editPswIcon" />
      </svg>
      <Typography sx={{ color: "#e3efff", fontSize: "14px", fontWeight: 500 }}>
        {label}
      </Typography>
    </Stack>

    <FormControl fullWidth sx={style.passwordfield}>
      <FilledInput
        name={name}
        value={value}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        placeholder={label}
        disableUnderline
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={toggle} edge="end" size="small">
              {showPassword ? (
                <ClosedEye style={{ color: "#b8b8b8", fontSize: "18px" }} />
              ) : (
                <EyeO style={{ color: "#b8b8b8", fontSize: "18px" }} />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  </Box>
);

export const style = {
  container: {
    background: "#05012B",
    width: "100%",
    height: "100vh",
    overflow: "auto",
  },
  header: {
    padding: "10px 8px",
    background: "zubgtext",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > p": {
      fontSize: "17px",
      fontWeight: "100",
      textAlign: "center",
      color: "white",
    },
    "& > a > svg": {
      color: "white",
      fontSize: "22px",
    },
  },

  inputfield: {
    width: "100%",
    mt: 2,
    color: "#fff",
    "&>div>div>input": {
      border: "1px solid rgba(255, 255, 255, 0.15)",
      padding: "10px 14px",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "14px",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.25)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      "&:focus": {
        borderColor: "#7d18d2",
        backgroundColor: "rgba(125, 24, 210, 0.05)",
      },
    },
    "&>div>div>fieldset": { display: "none" },
  },

  passwordfield: {
    "&>div": {
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      transition: "all 0.2s ease",
      padding: "0 14px",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.25)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      "&:focus-within": {
        borderColor: "#7d18d2",
        backgroundColor: "rgba(125, 24, 210, 0.05)",
      },
    },
    "&>div>input": {
      padding: "10px 0",
      color: "#fff",
      fontSize: "14px",
    },
    "&>div::before, &>div::after": {
      display: "none",
    },
  },

  selectfield: {
    "&>div>div": {
      borderColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: "8px",
      padding: "10px 14px",
      color: "#fff",
      fontSize: "14px",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      transition: "all 0.2s ease",
    },
    "&>div>fieldset": {
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "8px",
    },
    "&>div": {
      mt: 2,
      color: "#fff",
      "&:hover>fieldset": {
        borderColor: "rgba(255, 255, 255, 0.25) !important",
      },
    },
  },

  mainwallettrbutton: {
    width: "100%",
    height: "auto",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ad49ff, #7d18d2) !important",
    padding: "12px 10px",
    mt: 2,
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(125, 24, 210, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #c25aff, #8e29e3) !important",
      boxShadow: "0 6px 16px rgba(125, 24, 210, 0.4)",
      transform: "translateY(-1px)",
    },
  },
};
