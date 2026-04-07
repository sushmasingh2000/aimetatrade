
import { Refresh } from '@mui/icons-material';
import { Box, Button, Container, FilledInput, FormControl, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { ArrowLeft, ClosedEye, EyeO } from '@react-vant/icons';
import axios from 'axios';
import { ClientJS } from 'clientjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { apiConnectorPost } from '../../services/apiconnector';
import { endpoint } from '../../services/urls';
import CustomCircularProgress from '../../shared/loder/CustomCircularProgress';
import SvgIcons from '../../SvgIcons';
import { countryCodes } from '../CountryCode';

function Registration() {
  const [countryCode, setCountryCode] = useState("91");
  const [countryName, setCountryName] = useState("IN");
  const client = new ClientJS();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const refParam = params.get("ref");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loding, setloding] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const fingerprint = client.getFingerprint();


  const generateCaptcha = async () => {
    try {
      const client = new ClientJS();
      const fingerprint = client.getFingerprint();
      const res = await axios.post(endpoint?.generate_captcha, {
        finger_id: String(fingerprint)
      })
      setCaptcha(res?.data?.captcha)
    }
    catch (e) {
      toast("Error captcha generating", {id:1})
    }
  };
  useEffect(() => {
    generateCaptcha()
  }, [])


  const emailOtp = async () => {
    try {
      const res = await apiConnectorPost(endpoint?.send_otp, {
        useremail: fk.values.email,
        type: "registration"
      })
      toast(res?.data?.message, { id: 1 })
      if (res?.data?.success) {
        setStep(2)
      }
    }
    catch (e) {
      console.log("error")
    }
  }

  const verifyOtp = async () => {
    try {
      const res = await apiConnectorPost(endpoint?.verify_otp, {
        useremail: fk.values.email,
        otp: otp.join("")
      })
      toast(res?.data?.message , {id:1})
      if (res?.data?.success) {
        setStep(3)
      }
    }
    catch (e) {
      console.log("error")
    }
  }

  const initialValue = {
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    referral_id: refParam,
    userCaptcha: '',
    countryCode: " ",
    country_name: " ",

  };

  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Enter Valid Email Address";
      }
      if (!values.mobile) {
        errors.mobile = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(values.mobile)) {
        errors.mobile = "Mobile number must be exactly 10 digits";
      }

      return errors;
    },
    onSubmit: () => {
      if (fk.values.password !== fk.values.confirm_password) {
        return toast("Please Confirm Password And Password are equal" , {id:1})
      }
      const reqBody = {
        full_name: fk.values.full_name,
        email: fk.values.email,
        mobile: String(fk.values.mobile),
        referral_id: fk.values.referral_id,
        password: fk.values.password,
        confirm_password: fk.values.confirm_password,
        userCaptcha: captchaInput,
        finger_id: String(fingerprint),
        countryCode: countryCode,
        country_name: countryName,
      };

      RegFunction(reqBody);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const RegFunction = async (reqBody) => {
    setloding(true);
    try {
      const response = await axios.post(endpoint.member_registration, reqBody);
      toast(response?.data?.message , {id:1});
      if (response?.data?.success) {
        navigate('/');
      }
    } catch (e) {
      console.log(e);

    } finally {
      setloding(false);
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };


  const commonInputSx = {
    height: 44,
    color: "#fff",
    borderRadius: "10px",

    "& input": {
      padding: "10px 14px",
      color: "#fff",
    },

    "& fieldset": {
      borderColor: "#fff",
    },

    "&:hover fieldset": {
      borderColor: "#49f3ff",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#49ffff",
    },
  };


  return (
    <>
      <style>
        {`
                .login_input_2 .css-j32q1y-MuiInputBase-root-MuiInput-root-MuiSelect-root .MuiSelect-icon {
    left: auto;
    margin-left: auto;
    right: 0;
}
    .css-1m043wj-MuiButtonBase-root-MuiMenuItem-root {
    padding: 5px 10px !important;
}
                `}
      </style>
      <Container sx={{
        minHeight: '100vh',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <SvgIcons />
        <CustomCircularProgress isLoading={loding} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative", pt: 2 }}
        >
          <ArrowLeft
            onClick={() => goBack()}
            style={{ color: "white", position: "absolute", left: 5, cursor: "pointer" }}
          />

          <Typography
            sx={{
              color: "white",
              fontSize: 20,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Registration
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', margin: 'auto', mt: 3 }} >
          {step == 1 &&
            <>
              <Box className="login_input">
                <Box className="icon_login">
                  <svg width="25" height="25" fill={'#49fff0'}><use xlinkHref="#icon-email"></use></svg>
                </Box>
                <FormControl fullWidth>
                  <TextField
                    id="email"
                    name="email"
                    onChange={fk.handleChange}
                    onBlur={fk.handleBlur} // zaruri hai
                    value={fk.values.email}
                    placeholder="please input your email"
                    fullWidth
                    type="email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                        backgroundColor: "transparent",
                        "& fieldset": { borderColor: "#fff" },
                        "&:hover fieldset": { borderColor: "#49c5ff" },
                        "&.Mui-focused fieldset": { borderColor: "#49e4ff" },
                      },
                      "& input": { color: "#fff", backgroundColor: "transparent" },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px transparent inset",
                        WebkitTextFillColor: "#fff",
                        transition: "background-color 5000s ease-in-out 0s",
                      },
                    }}
                  />

                </FormControl>
              </Box>
              {fk.touched.email && fk.errors.email && (
                <Typography
                  variant="body2"
                  sx={{ color: "#ff4d4f !important", mt: 0.5, ml: 1 }} // red color, margin top & left
                >
                  {fk.errors.email}
                </Typography>
              )}
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#e3efff', mt: 2 }}>We Will Send a 6 Digit OTP to this E-mail Address.</Typography>
                <Typography sx={{ fontSize: '12px', color: '#e3efff', mt: 1 }}>Please Enter a Valid E-mail Address to Receive OTP.</Typography>
                <Button onClick={emailOtp} sx={{
                  padding: '6px', width: '100%', background: 'linear-gradient(90deg, #04fcf8, #fa0ef5)',
                  color: '#fff', borderRadius: '20px', mb: 2, mt: 5, fontSize: '19px', fontWeight: '700', '&:hover': { background: 'linear-gradient(90deg, #ad49ff, #7d18d2)' },
                }}>Send OTP</Button>
              </Box>
            </>
          }

          {step === 2 &&
            <>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center">
                  <svg style={{ marginRight: '10px' }} className="svg-icon" width="25" height="25" fill={'#ad49ff'}>
                    <use xlinkHref="#icon-email"></use>
                  </svg>
                  <Typography variant="body1" color="initial" sx={{ fontSize: '16px', fontWeight: '400', color: '#e3efff' }}>
                    Mail
                  </Typography>
                </Stack>
                <FormControl fullWidth sx={{ ...style.inputfield }}>
                  <TextField
                    className="sub"
                    value={fk.values.email}
                    label=""
                    fullWidth
                    type="email"
                    size="small"
                    sx={commonInputSx}
                  />
                  <Typography sx={{ fontSize: '12px', color: '#e3efff', mt: 1 }}>
                    We have sent a 6-digit OTP to your email.
                  </Typography>
                </FormControl>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <svg style={{ marginRight: '10px' }} className="svg-icon" width="25" height="25" fill={'#ad49ff'}>
                    <use xlinkHref="#icon-email"></use>
                  </svg>
                  <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 400, color: '#e3efff' }}>
                    OTP
                  </Typography>
                </Stack>

                {/* Optional helper note above OTP boxes */}
                <Typography sx={{ fontSize: '12px', color: '#e3efff', mt: 1, textAlign: 'center' }}>
                  Enter the 6-digit code sent to your email. OTP is valid for 5 minutes.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      placeholder="*"
                      value={digit}
                      id={`otp-${index}`}
                      type="number"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ""); // only digits
                        if (!val) return;
                        const newOtp = [...otp];
                        newOtp[index] = val[0];
                        setOtp(newOtp);

                        // auto focus next input if digit entered
                        if (index < 5) {
                          setTimeout(() => {
                            document.getElementById(`otp-${index + 1}`)?.focus();
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
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        if (!pasteData) return;
                        const newOtp = [...otp];
                        for (let i = 0; i < pasteData.length; i++) {
                          newOtp[i] = pasteData[i];
                        }
                        setOtp(newOtp);

                        // focus after last pasted digit
                        const nextIndex = Math.min(pasteData.length, 5);
                        setTimeout(() => {
                          document.getElementById(`otp-${nextIndex}`)?.focus();
                        }, 0);
                      }}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: 'center',
                          fontSize: '20px',
                          width: '25px',
                          height: '25px',
                          backgroundColor: 'white',
                          color: 'black',
                          borderRadius: '8px',
                        },
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>



                {/* <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    placeholder="*"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const newOtp = [...otp];
                      newOtp[index] = val[0] || "";
                      setOtp(newOtp);

                      if (val && index < 5) {
                        const nextInput = document.getElementById(`otp-${index + 1}`);
                        nextInput?.focus();
                      }
                    }}

                    id={`otp-${index}`}
                    type="text"
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontSize: '20px',
                        width: '25px',
                        height: '25px',
                        backgroundColor: 'white',
                        color: 'black',
                        borderRadius: '8px',
                      },
                    }}
                    variant="outlined"
                  />
                ))}
              </Box> */}
              </Box>

              <Button
                onClick={verifyOtp}
                sx={{
                  padding: '6px',
                  width: '100%',
                  background: 'linear-gradient(90deg, #04fcf8, #fa0ef5)',
                  color: '#fff',
                  borderRadius: '20px',
                  mb: 2,
                  fontSize: '19px',
                  mt: 5,
                  fontWeight: '700',
                  '&:hover': { background: 'linear-gradient(90deg, #04fcf8, #fa0ef5)' },
                }}
              >
                Verify OTP
              </Button>
            </>
          }

          {step === 3 &&
            <>
              <Box component="form" onSubmit={fk.handleSubmit}>
                <Box className="login_input" sx={{ mt: 2 }}>
                  <Box className="icon_login">
                    <svg width="25" height="25" fill={'#49ffff'}><use xlinkHref="#icon-user"></use></svg>
                  </Box>
                  <FormControl fullWidth >
                    <TextField
                      id="full_name" name="full_name" onChange={fk.handleChange} value={fk.values.full_name} label=""
                      placeholder="please input your name" fullWidth type="text"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          backgroundColor: "transparent",   // default bg
                          "& fieldset": {
                            borderColor: "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: "#49ffff",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "transparent",  // focus pe bhi transparent
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#49cbff",
                          },
                        },

                        // 🔥 Important: Autofill white fix
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px transparent inset",
                          WebkitTextFillColor: "#fff",
                          transition: "background-color 5000s ease-in-out 0s",
                        },

                        "& input": {
                          color: "#fff",
                          backgroundColor: "transparent",
                        },
                      }}

                    />
                  </FormControl>
                </Box>
                <Box className="login_input" sx={{ mt: 2 }}>
                  <Box className="icon_login">
                    <svg width="25" height="25" fill={'#49f9ff'}><use xlinkHref="#icon-email"></use></svg>
                  </Box>
                  <FormControl fullWidth>
                    <TextField id="username" name="username" placeholder='Please Input Your Email' value={fk.values.email} label=""
                      fullWidth type="email"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          backgroundColor: "transparent",
                          "& fieldset": {
                            borderColor: "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: "#49ffff",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "transparent",  // focus pe bhi transparent
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#49fff0",
                          },
                        },

                        // 🔥 Important: Autofill white fix
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px transparent inset",
                          WebkitTextFillColor: "#fff",
                          transition: "background-color 5000s ease-in-out 0s",
                        },

                        "& input": {
                          color: "#fff",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  </FormControl>
                </Box>
                <Box sx={{ mt: 2 }} className="login_input login_input_2" >
                  <Box className="icon_login">
                    <svg width="25" height="25" fill={'#49c5ff'}><use xlinkHref="#icon-phone"></use></svg>
                  </Box>
                  <FormControl fullWidth>
                    <TextField
                      id="mobile"
                      name="mobile"
                      type="number"
                      placeholder="Please Input Mobile"
                      value={fk.values.mobile}
                      onChange={fk.handleChange}
                      onBlur={fk.handleBlur}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              display: "flex",
                              alignItems: "center",

                            }}
                          >
                            <Select
                              value={countryCode}
                              onChange={(e) => {
                                const selectedCode = e.target.value;
                                setCountryCode(selectedCode);
                                const selectedCountry = countryCodes.find(c => c.code === selectedCode);
                                setCountryName(selectedCountry?.country || "");
                              }}
                              variant="standard"
                              disableUnderline
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    bgcolor: "#1e1e1e",
                                    color: "#fff",
                                    border: "1px solid #1b9a89",
                                    maxHeight: 250,
                                    paddingLeft: "2px",
                                  },
                                },
                              }}
                              sx={{
                                color: "#fff",
                                fontSize: "12px",
                                minWidth: 60,
                                ml: 5,
                                "& .MuiSelect-icon": {
                                  color: "#fff",
                                },
                              }}
                            >
                              {countryCodes.map(({ country, code }, index) => (
                                <MenuItem
                                  key={country}
                                  value={code}
                                  sx={{
                                    fontSize: "13px",
                                    borderBottom:
                                      index !== countryCodes.length - 1
                                        ? "1px solid rgba(255,255,255,0.1)"
                                        : "none",
                                    "&:hover": { bgcolor: "#2a2a2a" },
                                    "&.Mui-selected": { bgcolor: "#1b879a !important", color: "#fff" },
                                  }}
                                >
                                  {country} +{code}
                                </MenuItem>
                              ))}
                            </Select>



                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          backgroundColor: "transparent",   // default bg
                          "& fieldset": {
                            borderColor: "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: "#49cbff",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "transparent",  // focus pe bhi transparent
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#49ffff",
                          },
                        },

                        // 🔥 Important: Autofill white fix
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px transparent inset",
                          WebkitTextFillColor: "#fff",
                          transition: "background-color 5000s ease-in-out 0s",
                        },

                        "& input": {
                          color: "#fff",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  </FormControl>
                </Box>
                {fk.touched.mobile && fk.errors.mobile && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#ff4d4f !important", mt: 0.5, ml: 1 }}
                  >
                    {fk.errors.mobile}
                  </Typography>
                )}


                {/* <Box className="login_input" sx={{ mt: 2 }}>
                <Box className="icon_login">
                  <svg width="25" height="25" fill={'#ad49ff'}><use xlinkHref="#icon-phone"></use></svg>
                </Box>
                <FormControl fullWidth >
                  <TextField
                    id="mobile" name="mobile" onChange={fk.handleChange} value={fk.values.mobile} label=""
                    placeholder="please input your mobile" fullWidth type="number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                        backgroundColor: "transparent",   // default bg
                        "& fieldset": {
                          borderColor: "#fff",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ad49ff",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "transparent",  // focus pe bhi transparent
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ad49ff",
                        },
                      },

                      // 🔥 Important: Autofill white fix
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px transparent inset",
                        WebkitTextFillColor: "#fff",
                        transition: "background-color 5000s ease-in-out 0s",
                      },

                      "& input": {
                        color: "#fff",
                        backgroundColor: "transparent",
                      },
                    }}
                  />
                </FormControl>
              </Box> */}
                <Box className="login_input" sx={{ mt: 2 }}>
                  <Box className="icon_login">
                    <svg width="25" height="25" fill={'#49ffe7'}><use xlinkHref="#icon-user"></use></svg>
                  </Box>
                  <FormControl fullWidth >
                    <TextField
                      id="referral_id" name="referral_id" onChange={fk.handleChange} value={fk.values.referral_id} label=""
                      placeholder="please input your referral ID" fullWidth type="text"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          backgroundColor: "transparent",   // default bg
                          "& fieldset": {
                            borderColor: "#fff",
                          },
                          "&:hover fieldset": {
                            borderColor: "#49f9ff",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "transparent",  // focus pe bhi transparent
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#49eaff",
                          },
                        },

                        // 🔥 Important: Autofill white fix
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px transparent inset",
                          WebkitTextFillColor: "#fff",
                          transition: "background-color 5000s ease-in-out 0s",
                        },

                        "& input": {
                          color: "#fff",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  </FormControl>
                </Box>
                <Box className="login_input_e" sx={{ mt: 2 }}>
                  <Box className="icon_login">
                    <svg width="25" height="25" fill={'#49dbff'}><use xlinkHref="#icon-editPswIcon"></use></svg>
                  </Box>
                  <FormControl fullWidth className='passowrld'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                        backgroundColor: "transparent",   // default bg
                        "& fieldset": {
                          borderColor: "#fff",
                        },
                        "&:hover fieldset": {
                          borderColor: "#49cbff",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "transparent",  // focus pe bhi transparent
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#49eaff",
                        },
                      },

                      // 🔥 Important: Autofill white fix
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px transparent inset",
                        WebkitTextFillColor: "#fff",
                        transition: "background-color 5000s ease-in-out 0s",
                      },

                      "& input": {
                        color: "#fff",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <FilledInput placeholder="please input password" id="password" name="password" onChange={fk.handleChange} value={fk.values.password} type={showPassword ? 'text' : 'password'}
                      endAdornment={<InputAdornment position="end"><IconButton sx={{
                        color: "#fff",
                        "&:hover": {
                          color: "#fff",
                          backgroundColor: "rgba(255,255,255,0.08)",
                        },
                      }} onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword} edge="end">
                        {showPassword ? <ClosedEye className='white' /> : <EyeO className=' white' />}
                      </IconButton>
                      </InputAdornment>
                      }

                    />
                  </FormControl>
                </Box>
                <Box className="login_input_e" sx={{ mt: 2 }}>
                  <Box className="icon_login">
                    <svg width="25" height="25" fill={'#49fff6'}><use xlinkHref="#icon-editPswIcon"></use></svg>
                  </Box>
                  <FormControl fullWidth className='passowrld' sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                      borderColor: "#fff",
                      "&:hover fieldset": {
                        borderColor: "#49ffd8", // hover color
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#49fff0", // focus color
                      },
                    },

                  }}>
                    <FilledInput placeholder="please input confirm password" id="confirm_password" name="confirm_password" onChange={fk.handleChange} value={fk.values.confirm_password} type={showConfirmPassword ? 'text' : 'password'}
                      endAdornment={<InputAdornment position="end"><IconButton sx={{
                        color: "#fff",
                        "&:hover": {
                          color: "#fff",
                          backgroundColor: "rgba(255,255,255,0.08)",
                        },
                      }} onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword} edge="end">
                        {showConfirmPassword ? <ClosedEye className='white' /> : <EyeO className=' white' />}
                      </IconButton>
                      </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              </Box>
              <Box mt={2} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>

                <Box sx={{
                  display: "flex", gap: 2, justifyContent: "start",

                }}>
               <img style={{height: "50px"}} src={captcha} alt=''  />
                  {/* <Typography sx={{
                    color: "white", p: "10px", border: "1px solid #aaa", width: "100px",
                    borderRadius: "5px", textAlign: "center",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}>  {captcha}</Typography> */}
                  <Refresh sx={{ color: "#49f3ff", cursor: "pointer", mt: 2 }} onClick={generateCaptcha} />


                </Box>
                <Box className="login_capta">
                  <FormControl fullWidth >
                    <TextField
                      fullWidth
                      placeholder="Enter captcha"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "5px",
                          borderColor: "#fff",
                          "&:hover fieldset": {
                            borderColor: "#49eaff", // hover color
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#49ffff", // focus color
                          },
                        },

                      }} />
                  </FormControl>
                </Box>

              </Box>
              {/* <Box mt={3}>
              <FormGroup mt={3}>
                <Checkbox style={{ '&>span': { fontSize: '12px', color: 'white' }, color: 'white' }} defaultChecked checkedColor='#ad49ff'>
                  <span style={{ color: "white" }} > Terms & Conditions</span>   <span onClick={() => navigate("/term_condition")} className='underline text-blue-800 text-xs' style={{ color: "#ad49ff" }}>Click here</span>
                </Checkbox>
              </FormGroup>
            </Box> */}
              <Box sx={{ width: '100%', margin: 'auto', mt: 3 }}>
                <Button onClick={() => fk.handleSubmit()} sx={{
                  padding: '6px', width: '100%', background: 'linear-gradient(90deg, #04fcf8, #fa0ef5)',
                  color: '#fff', borderRadius: '20px', mb: 2, fontSize: '16px', fontWeight: '700', '&:hover': { background: 'linear-gradient(90deg, #04fcf8, #fa0ef5)' },
                }}>Register</Button>
                <NavLink to="/">
                  <Button sx={{ padding: '3px 15px !important', borderColor: '#49cbff', color: '#49f9ff', width: '100%', borderRadius: '20px', fontSize: '16px', fontWeight: '700', '&:hover': { color: '#fff', borderColor: '#fff', } }}
                    variant="outlined">Log in</Button>
                </NavLink>
              </Box>
            </>}
        </Box >
      </Container >
    </>
  );
}

export default Registration;

const style = {
  inputfield: { width: '100%', mt: 1, color: '#fff', '&>div>div>input': { border: '1px solid #fff', borderRadius: '10px', color: '#fff' }, '&>div>div>fieldset': { color: '#fff' }, '&>div>div>input:focus': { color: '#fff' } },
  passwordfield: { '&>div>input': { padding: 1, color: '#fff' }, '&>div': { mt: 2, border: '1px solid #fff', borderRadius: '10px', color: '#ffff' }, '&>div::before': { color: '#fff' }, '&>div::after:focus': { color: '#fff', } },
  selectfield: { '&>div>div': { borderColor: "#fff", borderRadius: '10px', padding: '11px 3px', color: '#fff' }, '&>div>fieldset': { border: '1px solid #fff', color: '#fff', borderRadius: '10px' }, '&>div': { mt: 1, color: '#fff' } }
};

