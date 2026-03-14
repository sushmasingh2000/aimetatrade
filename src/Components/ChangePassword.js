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
    Typography,
} from "@mui/material";
import { ArrowLeft, ClosedEye, EyeO } from "@react-vant/icons";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import Header2 from "./Layouts/Header2";
import SvgIcons from "../SvgIcons";
import { apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";

const ChangeLoginPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setloding] = useState(false);

    const formik = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },

        onSubmit: async (values) => {
            setloding(true)
            try {
                const reqbody = {
                    old_pass: values.old_password,
                    new_pass: values.new_password,
                    confirm_pass: values.confirm_password,
                };

                const res = await apiConnectorPost(endpoint.change_psw, reqbody);
                toast(res?.data?.message);
                setloding(false)
                if (res?.data?.success) {
                    navigate("/")
                }
            } catch (error) {
                toast.error("Something went wrong");
                setloding(false)
            }
        },
    });

    return (
        <>
            <Header2 title="Change Password" />
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
                        <PasswordField
                            label="Current Login Password"
                            name="old_password"
                            value={formik.values.old_password}
                            onChange={formik.handleChange}
                            showPassword={showPassword}
                            toggle={() => setShowPassword(!showPassword)}
                        />

                        {/* NEW PASSWORD */}
                        <PasswordField
                            label="New Login Password"
                            name="new_password"
                            value={formik.values.new_password}
                            onChange={formik.handleChange}
                            showPassword={showPassword}
                            toggle={() => setShowPassword(!showPassword)}
                        />

                        {/* CONFIRM PASSWORD */}
                        <PasswordField
                            label="Confirm Login Password"
                            name="confirm_password"
                            value={formik.values.confirm_password}
                            onChange={formik.handleChange}
                            showPassword={showPassword}
                            toggle={() => setShowPassword(!showPassword)}
                        />

                        <Button
                            type="submit"
                            sx={style.mainwallettrbutton}
                            className="roboto !mt-8"
                        >
                            Save Changes
                        </Button>
                    </form>
                </Box>
            </Container>
        </>
    );
};

export default ChangeLoginPassword;

const PasswordField = ({ label, name, value, onChange, showPassword, toggle }) => (
    <Box mt={2}>
        <Stack direction="row" alignItems="center">
            <svg
                style={{ marginRight: "10px" }}
                width="25"
                height="25"
                fill="#7d18d2"
            >
                <use xlinkHref="#icon-editPswIcon" />
            </svg>
            <Typography sx={{ color: "#e3efff" }}>{label}</Typography>
        </Stack>

        <FormControl fullWidth sx={style.passwordfield}>
            <FilledInput
                name={name}
                value={value}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                placeholder={label}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={toggle} edge="end">
                            {showPassword ? (
                                <ClosedEye style={{ color: "#fff" }} />
                            ) : (
                                <EyeO style={{ color: "#fff" }} />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    </Box>
);


export const style = {
    container: { background: '#05012B', width: '100%', height: '100vh', overflow: 'auto', },
    header: {
        padding: '10px 8px',
        background: "zubgtext",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& > p': {
            fontSize: '17px',
            fontWeight: '400',
            textAlign: 'center',
            color: 'white',
        },
        '& > a > svg': {
            color: 'white',
            fontSize: '22px'
        }
    },

    inputfield: { width: '100%', mt: 2, color: '#fff', '&>div>div>input': { border: '1px solid #fff', padding: 3, borderRadius: '10px', color: '#fff' }, '&>div>div>fieldset': { color: '#fff' }, '&>div>div>input:focus': { color: '#fff' } },
    passwordfield: { '&>div>input': { padding: 3, color: '#fff' }, '&>div': { mt: 2, border: '1px solid #fff', borderRadius: '10px', color: '#ffff' }, '&>div::before': { color: '#fff' }, '&>div::after:focus': { color: '#fff', } },
    selectfield: { '&>div>div': { borderColor: "#fff", borderRadius: '10px', padding: '11px 3px', color: '#fff' }, '&>div>fieldset': { border: '1px solid #fff', color: '#fff', borderRadius: '10px' }, '&>div': { mt: 2, color: '#fff' } },

    mainwallettrbutton: {
        width: "100%",
        height: "0.93333rem",
        color: "black",
        fontSize: "17px",
        fontWeight: "700",
        letterSpacing: "0.01333rem",
        border: "none",
        borderRadius: "20px",
        background: "linear-gradient(90deg,#ad49ff,#7d18d2) !important",
        padding: "20px 10px",
        mt: 2,
        "&:hover": {
            color: "white",
            background: "#eb8a1f",
        },
    }
};