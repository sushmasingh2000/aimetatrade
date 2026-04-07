
import { Box, Button, Container, FormControl, Stack, TextField, Typography } from '@mui/material';
import { ArrowLeft } from '@react-vant/icons';
import axios from 'axios';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiConnectorPost } from '../../services/apiconnector';
import { endpoint } from '../../services/urls';
import CustomCircularProgress from '../../shared/loder/CustomCircularProgress';
import SvgIcons from '../../SvgIcons';
import { useState } from 'react';
import Swal from 'sweetalert2';

function Forgotpassword() {
    const [loding, setLoading] = useState(false);
    const navigate = useNavigate();

    const initialValue = { email: '' };

    const fk = useFormik({
        initialValues: initialValue,
        enableReinitialize: true,
        validate: (values) => {
            const errors = {};
            if (!values.email) errors.email = "Email is required";
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
                errors.email = "Enter Valid Email Address";
            return errors;
        },
        onSubmit: async () => {
            await sendEmailOtp();
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    // Send Email OTP
    const sendEmailOtp = async () => {
        if (!fk.values.email) return;
        setLoading(true);
        try {
            const res = await apiConnectorPost(endpoint?.forgot_registration, { useremail: fk.values.email });
            setLoading(false);
            if (res?.data?.success) {
                // Show SweetAlert2 success popup
                await Swal.fire({
                    icon: 'success',
                    title: 'Email Sent!',
                    text: 'Your password has been sent to your E-mail Address.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ad49ff',
                    background: '#1e1e1e',
                    color: '#fff',
                });

                // Navigate to login after OK
                navigate('/');
            } else {
                // Show SweetAlert2 error popup
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res?.data?.message || 'Something went wrong',
                    confirmButtonColor: '#ad49ff',
                    background: '#1e1e1e',
                    color: '#fff',
                });
            }

        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong!',
                confirmButtonColor: '#ad49ff',
                background: '#1e1e1e',
                color: '#fff',
            });
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => navigate(-1);


    return (
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
                    Forgot Password
                </Typography>
            </Stack>

            <Box sx={{ width: '100%', margin: 'auto', mt: 3 }} >

                <Box className="login_input">
                    <Box className="icon_login">
                        <svg width="25" height="25" fill={'#49f3ff'}><use xlinkHref="#icon-email"></use></svg>
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
                                    "&:hover fieldset": { borderColor: "#ad49ff" },
                                    "&.Mui-focused fieldset": { borderColor: "#ad49ff" },
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
                    <Typography sx={{ fontSize: '12px', color: '#e3efff', mt: 1 }}>Please Enter a Valid E-mail Address to Receive E-mail.</Typography>
                    <Button onClick={sendEmailOtp} sx={{
                        padding: '6px', width: '100%', background: 'linear-gradient(90deg, #ad49ff, #7d18d2)',
                        color: '#fff', borderRadius: '20px', mb: 2, mt: 5, fontSize: '19px', fontWeight: '700', '&:hover': { background: 'linear-gradient(90deg, #ad49ff, #7d18d2)' },
                    }}>Forgot</Button>
                </Box>
            </Box >
        </Container >
    );
}

export default Forgotpassword;

const style = {
    inputfield: { width: '100%', mt: 1, color: '#fff', '&>div>div>input': { border: '1px solid #fff', borderRadius: '10px', color: '#fff' }, '&>div>div>fieldset': { color: '#fff' }, '&>div>div>input:focus': { color: '#fff' } },
    passwordfield: { '&>div>input': { padding: 1, color: '#fff' }, '&>div': { mt: 2, border: '1px solid #fff', borderRadius: '10px', color: '#ffff' }, '&>div::before': { color: '#fff' }, '&>div::after:focus': { color: '#fff', } },
    selectfield: { '&>div>div': { borderColor: "#fff", borderRadius: '10px', padding: '11px 3px', color: '#fff' }, '&>div>fieldset': { border: '1px solid #fff', color: '#fff', borderRadius: '10px' }, '&>div': { mt: 1, color: '#fff' } }
};

