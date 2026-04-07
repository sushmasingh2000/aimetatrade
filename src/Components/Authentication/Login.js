
import { Download, Refresh } from '@mui/icons-material';
import { Box, Button, Container, FormControl, FormGroup, IconButton, InputAdornment, List, ListItem, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import { ClosedEye, EyeO } from '@react-vant/icons';
import axios from 'axios';
import { ClientJS } from 'clientjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Checkbox } from 'react-vant';
import SvgIcons from '../../SvgIcons';
import logo from "../../assets/images/logo/logo.png";
import { endpoint } from '../../services/urls';


function Login() {
    const navigate = useNavigate();
    const client = new ClientJS();
    const fingerprint = client.getFingerprint();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

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
            toast("Error captcha generating")
        }
    };
    useEffect(() => {
        generateCaptcha()
    }, [])

    const fk = useFormik({
        initialValues: {
            username: '',
            password: '',
            userCaptcha: ""
        },
        onSubmit: () => {
            const reqBody = {
                username: String(fk.values.username),
                password: fk.values.password,
                lgn_type: 2,
                userCaptcha: captchaInput,
                finger_id: String(fingerprint)
            };

            loginFunction(reqBody);
        },
    });

    const loginFunction = async (reqBody) => {
        setLoading(true);
        try {
            const response = await axios.post(endpoint.member_login, reqBody);
            toast(response?.data?.message)
            if (response?.data?.success) {
                localStorage.setItem('token', response?.data?.result?.[0]?.token);
                localStorage.setItem('type', response?.data?.result?.[0]?.user_type);
                navigate('/dashboard');
                window.location.reload();
            }
        } catch (e) {
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Box component="header">
                <List sx={{ display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <ListItem sx={{ width: "auto" }}>
                        <Typography
                            onClick={() => {
                                navigate("/download");
                                window.location.reload();
                            }}
                        >
                            <Download sx={{ mt: 1 }} />
                        </Typography>

                    </ListItem>

                    {/* Dynamic Title */}
                    <ListItem sx={{ width: "auto" }}>

                    </ListItem>



                </List>
            </Box>
            <Container
                sx={{
                    minHeight: "100vh",
                    px: "10px !important",
                }}
            >

                <SvgIcons />

                <Stack

                    alignItems="center"
                    justifyContent="center"
                    sx={{ position: "relative", pt: 2 }}
                >

                    <Box className="logo_login">
                        <img src={logo} alt='logo' />
                    </Box>


                    <Typography
                        sx={{
                            color: "white",
                            fontSize: 30,
                            fontWeight: 600,
                            textAlign: "center",
                        }}
                    >
                        Login
                    </Typography>
                </Stack>

                {/* Form */}
                <Box sx={{ width: "100%", mx: "auto", mt: 3 }}>
                    <Box component="form" onSubmit={fk.handleSubmit}>
                        <Box className="login_input">
                            <Box className="icon_login">
                                <svg width="25" height="25" fill="#49f9ff">
                                    <use xlinkHref="#icon-email" />
                                </svg>
                            </Box>
                            <TextField fullWidth placeholder="please input your email" name="username" value={fk.values.username} onChange={fk.handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "5px",
                                        backgroundColor: "transparent",   // default bg
                                        "& fieldset": {
                                            borderColor: "#fff",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#49eaff",
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "transparent",  // focus pe bhi transparent
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#49c5ff",
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
                        </Box>
                        <Box className="login_input_e" sx={{ mt: 2 }}>
                            <Box className="icon_login">
                                <svg width="25" height="25" fill="#49ffff">
                                    <use xlinkHref="#icon-editPswIcon" />
                                </svg>
                            </Box>
                            <FormControl className='passowrld' fullWidth
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
                                            borderColor: "#49d5ff",
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
                                <OutlinedInput
                                    name="password"
                                    value={fk.values.password}
                                    onChange={fk.handleChange}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="please input your password"
                                    autoComplete="new-password"
                                    inputProps={{
                                        autoCapitalize: "none",  // iOS / mobile
                                        autoCorrect: "off",       // Android
                                        spellCheck: false,        // suggestions off
                                        style: { textTransform: "none" } // CSS fix
                                    }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                sx={{
                                                    color: "#fff",
                                                    "&:hover": {
                                                        color: "#fff",
                                                        backgroundColor: "rgba(255,255,255,0.08)",
                                                    },
                                                }}
                                            >
                                                {showPassword ? <ClosedEye /> : <EyeO />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Box>





                        {/* Captcha */}
                        <Box mt={2} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Box>

                                <Box sx={{
                                    display: "flex", gap: 2, justifyContent: "start",

                                }}>
                                    <img style={{ height: "50px" }} src={captcha} alt='' />
                                    {/* <Typography sx={{
                                        color: "white", p: "10px", border: "1px solid #aaa", width: "100px",
                                        borderRadius: "5px", textAlign: "center",
                                        userSelect: "none",
                                        WebkitUserSelect: "none",
                                        MozUserSelect: "none",
                                        msUserSelect: "none",
                                    }}>  {captcha}</Typography> */}
                                    <Refresh sx={{ color: "#49fff6", cursor: "pointer", mt: 2 }} onClick={generateCaptcha} />
                                </Box>
                            </Box>

                            <Box className="login_capta">
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
                                                borderColor: "#49ffff", // hover color
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#49fff0", // focus color
                                            },
                                        },

                                    }} />
                            </Box>
                        </Box>




                        <Box className="check_nput" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                            <FormGroup >
                                <Checkbox checkedColor="#49c5ff" style={{ color: "#fff" }}>
                                    <span style={{ color: "white" }} >Remember my password</span>
                                </Checkbox>
                            </FormGroup>
                            <Box className="forgot_pa">
                                <Link to='/forgot'>Forgot Password?</Link>
                            </Box>
                        </Box>

                        {/* Buttons */}
                        <Box sx={{ width: "100%", mx: "auto", mt: 3 }}>
                            <Button
                                type="submit"
                                disabled={loading}
                                sx={{
                                    width: "100%",
                                    height: 44,
                                    background: "linear-gradient(90deg, #04fcf8, #fa0ef5)",
                                    color: "#fff",
                                    borderRadius: "20px",
                                    fontSize: "16px",
                                    fontWeight: 700,
                                }}
                            >
                                {loading ? "Logging in..." : "Log in"}
                            </Button>

                            <NavLink to="/register">
                                <Button
                                    variant="outlined"
                                    sx={{
                                        mt: 2,
                                        width: "100%",
                                        height: 44,
                                        borderColor: "#49f3ff",
                                        color: "#49dbff",
                                        borderRadius: "20px",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                    }}
                                >
                                    Register
                                </Button>
                            </NavLink>

                            {/* <Button
                            onClick={() => {
                                navigate("/download");
                                window.location.reload();
                            }}
                            variant="outlined"
                            sx={{
                                mt: 2,
                                width: "100%",
                                height: 44,
                                borderColor: "#9f3bf2",
                                color: "#fff",
                                borderRadius: "20px",
                                fontSize: "18px",
                                fontWeight: 700,
                            }}
                        >
                            Download App
                        </Button> */}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>

    );
}

export default Login;



