import {
    Box,
    Button,
    Container,
    Grid,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import copy from 'clipboard-copy';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import coin1 from "../assets/images/chart-icon/1.png";
import { apiConnectorGet } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import Header2 from "./Layouts/Header2";
import Swal from "sweetalert2";
import { Refresh } from "@mui/icons-material";
import { getFloatingValue } from "../utils/utilityFun";


export default function Deposit() {
    const [tabValue, setTabValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [timer, setTimer] = React.useState(600); // 10 minutes
    const [qrGenerated, setQrGenerated] = useState(false);
    const [amount, setAmount] = useState("");
    const client = useQueryClient();

    const { data: wallet, refetch } = useQuery(
        ["dashboard"],
        () => apiConnectorGet(endpoint?.member_details
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const user = wallet?.data?.result[0] || []

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
    };

    const { data: qrData, isLoading: qrLoading, refetch: refetchQR } = useQuery(
        ["get_topup_qr"],
        () => apiConnectorGet(endpoint?.get_topup_qr),
        {
            enabled: qrGenerated,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        }
    );

    const topup_qr = qrData?.data?.result?.[0] || {};

    const defaultQR = "https://w7.pngwing.com/pngs/1006/79/png-transparent-qr-code-qr-code-qr-code-thumbnail.png"

    const handleGenerateQR = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        setQrGenerated(true);
        setTimer(600);
        refetchQR();
    };

    const handleDepositClick = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to verify this payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, verify it!",
            cancelButtonText: "Cancel",
            customClass: {
                icon: 'my-swal-icon',
                title: 'my-swal-title',
                content: 'my-swal-content',
                cancelButton: 'swal2-cancel-btn-red',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const res = await apiConnectorGet(endpoint?.member_self_topup);
                    setLoading(false);

                    const msg = res?.data?.msg;
                    const isSuccess = res?.data?.success || res?.status === 200;
                    Swal.fire({
                        title: isSuccess ? "Success!" : "Error!",
                        text: msg,
                        icon: isSuccess ? "success" : "error",
                        confirmButtonText: "OK",
                        customClass: {
                            icon: 'my-swal-icon',
                            title: 'my-swal-title',
                            content: 'my-swal-content',
                            cancelButton: 'swal2-cancel-btn-red',
                        }
                    });

                    if (isSuccess) {
                        refetch();
                    }
                } catch (e) {
                    const errorMsg =
                        e?.response?.data?.msg ||
                        e?.response?.data?.message ||
                        "Error verifying payment";

                    Swal.fire({
                        title: "Error!",
                        text: errorMsg,
                        icon: "error",
                        confirmButtonText: "OK",
                    });

                    setLoading(false);
                }
            }
        });
    };


    const functionTOCopy = (value) => {
        copy(value);
        toast('Copied to clipboard!', { id: 1 });
    };

    useEffect(() => {
        if (!qrGenerated || !topup_qr?.address) return;

        // Set expiry time when QR generated
        const expiryTime = Date.now() + 600000; // 10 minutes

        const interval = setInterval(() => {
            const remaining = Math.floor((expiryTime - Date.now()) / 1000);

            if (remaining <= 0) {
                refetchQR();
                return;
            }

            setTimer(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [qrGenerated, topup_qr?.address]);


    const globalFn = async () => {
        setLoading(true)
        try {
            const res = await apiConnectorGet(endpoint?.member_global_topup)
            setLoading(false)
            toast(res?.data?.msg, { id: 1 })
            console.log(res.data, "res of global topup")
        }
        catch (e) {
            setLoading(false)
            console.log("something went wrong")
        }
    }


    return (
        <Box
            sx={{ minHeight: "100vh", bgcolor: "#1d1b1b", pb: 4 }}
        >
            <Header2
                title="Deposit"
                historyRoute="/Deposite-history"
            />
            <Container >
                <CustomCircularProgress isLoading={loading || qrLoading} />

                {/* Top Section */}
                <Grid container spacing={2} sx={{ px: 2, mt: 3, alignItems: "center" }}>
                    <Grid size={{ lg: 7, xs: 7 }}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }} className="Usdt_box">
                            <Box component="img" src={coin1} alt="coin" />
                            <Typography variant="h6">USDT</Typography>
                        </Box>
                    </Grid>

                    <Grid size={5} lg={5}>
                        <Box className="select_currency" sx={{ color: "white", ml: "18px" }}>
                            Spot:  <span style={{ color: "#38bd1e" }}>${getFloatingValue(user?.tr03_fund_wallet)}</span>
                        </Box>
                    </Grid>
                </Grid>

                {/* Tabs Section */}
                <Box sx={{ px: 2, mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h6" sx={{ fontSize: "14px" }}>
                            Chain:
                        </Typography>
                        {/* <Button
                            onClick={globalFn}
                            sx={{
                                minWidth: 'auto',
                                paddingRight: "10px",
                                color: "#ad49ff",
                                '&:hover': { backgroundColor: 'transparent' }
                            }}
                            aria-label="refresh QR code"
                        >
                            Refresh {" "}  <Refresh />
                        </Button> */}
                    </Box>

                    <Tabs value={tabValue} onChange={handleTabChange} sx={{
                        "& .MuiTab-root": {
                            color: "#999",
                            textTransform: "capitalize",
                            fontWeight: 500,
                        },
                        "& .MuiTab-root.Mui-selected": {
                            color: "#ad49ff",
                        },
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#ad49ff",
                        },
                    }}>
                        <Tab label="BEP20" />
                        {/* <Tab label="ERC20" /> */}
                    </Tabs>

                    {tabValue === 0 &&
                        (
                            <>

                                <Box sx={{ mt: 5 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: "16px !important",
                                            fontWeight: 400,
                                            color: "#e3efff",
                                        }}
                                    >
                                        Enter Amount
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Amount"
                                        name="amount"
                                        type="number"
                                        inputProps={{ min: 1, step: 1 }}
                                        value={amount}
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            // Remove minus
                                            value = value.replace("-", "");

                                            // Remove decimal
                                            if (value.includes(".")) {
                                                value = value.split(".")[0];
                                            }

                                            setAmount(value);
                                        }}
                                        onKeyDown={(e) => {
                                            // Block -, +, e (scientific notation)
                                            if (e.key === "-" || e.key === "+" || e.key === "e") {
                                                e.preventDefault();
                                            }
                                        }}
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
                                            mt: 2
                                        }}
                                    />
                                </Box>

                                {/* QR Section */}
                                <Box sx={{ mt: 3, textAlign: "center", position: "relative" }}>
                                    {!qrGenerated && (
                                        <Box
                                            component="img"
                                            src={defaultQR}  // API se aaya QR ya default QR
                                            alt="QR Code"
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                filter: "blur(8px)",  // blur tab tak jab tak generate na ho
                                                transition: "filter 0.3s ease"
                                            }}
                                        />
                                    )}


                                    {!qrGenerated && amount && Number(amount) > 0 && (
                                        <Button
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                zIndex: 2,
                                                background: "#ad49ff !important",
                                                color: "white !important"
                                            }}
                                            onClick={handleGenerateQR}
                                        >
                                            Generate QR
                                        </Button>
                                    )}
                                </Box>


                                <Box p={2} className="scanner">
                                    {qrGenerated && (
                                        <Box>
                                            <Box component="img" src={topup_qr?.qr} alt="scanner"></Box>
                                            <Button className="qr_code" onClick={() => {
                                                functionTOCopy(
                                                    `${topup_qr?.address}`
                                                );
                                            }}>Copy the Address</Button>
                                            <Typography variant="h6">Deposit Address</Typography>
                                            <Typography>{topup_qr?.address}</Typography>
                                            {topup_qr?.address && (
                                                <>
                                                    <Button onClick={handleDepositClick} className="copy_btn">
                                                        Verify Transaction
                                                    </Button>

                                                    {/* <Typography
                                                        sx={{
                                                            mt: 2,
                                                            textAlign: "left",
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Auto update new address in:{" "}
                                                        <Box
                                                            component="span"
                                                            sx={{ color: "red" }}
                                                        >
                                                            {`${Math.floor(timer / 60)
                                                                .toString()
                                                                .padStart(2, "0")}:${(timer % 60)
                                                                    .toString()
                                                                    .padStart(2, "0")}`}

                                                        </Box>
                                                    </Typography> */}
                                                </>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )
                    }

                </Box>

                {/* Notes */}
                <Box className="note_main" sx={{ px: 2, mt: 2, pb: 3, mb: 8 }}>
                    {/* <Typography variant="h5">Offsite Link:</Typography> */}
                    <Typography variant="h6">Disclaimer:</Typography>

                    <Typography sx={{ mt: 1 }}>
                        Minimum Deposit is $1.
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Generate First:</strong> Enter your amount first to generate a unique QR code or wallet address. Only send funds to the address.
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Verify Transaction:</strong> After sending the funds, you must click the Verify transaction or refresh it. Your deposit will not be credited automatically without this step.
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Claim Your Funds:</strong> If the deposit doesn't appear after verification, go to Transaction History to manually "Claim" your funds.
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Network Confirmations:</strong> Deposits require standard network node confirmations. Please wait a few minutes for the blockchain to process your request.
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <strong>Security Check:</strong> Ensure you are using the official platform address. Any funds sent to the wrong address or incorrect network cannot be recovered.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
