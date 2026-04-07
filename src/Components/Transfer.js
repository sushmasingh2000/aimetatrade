import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
} from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getFloatingValue } from "../utils/utilityFun";
import Header2 from "./Layouts/Header2";

export default function Transfer() {
    const [walletType, setWalletType] = useState("");
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("USDT"); // Asset fixed to USDT
    const client = useQueryClient();

    const fk = useFormik({
        initialValues: { inr_value: "" },
        onSubmit: () => { },
    });

    const { data } = useQuery(
        ["dashboard"],
        () => apiConnectorGet(endpoint?.member_details),
        { refetchOnMount: false, refetchOnWindowFocus: true, refetchOnReconnect: true }
    );

    const user = data?.data?.result?.[0] || {};

    async function SpotWallet() {
        const reqbody = { pkg_amount: Number(fk.values.inr_value) };
        try {
            const res = await apiConnectorPost(endpoint?.activation_user, reqbody);
            toast(res?.data?.message);
            if (res?.data?.success) {
                client.refetchQueries("dashboard");
                fk.resetForm();
            }
        } catch (e) {
            console.error(e);
            toast.error("Spot transfer failed");
        }
        setLoading(false);
    }

    async function ProfitWallet() {
        const reqbody = { amount: Number(fk.values.inr_value) };
        try {
            const res = await apiConnectorPost(endpoint?.member_compound_request, reqbody);
            toast(res?.data?.message);
            if (res?.data?.success) {
                client.refetchQueries("dashboard");
                fk.resetForm();
            }
        } catch (e) {
            console.error(e);
            toast.error("Profit transfer failed");
        }
        setLoading(false);
    }

    

    const handleSubmit = () => {
        if (!walletType) {
            toast.error("Please select wallet");
            return;
        }
        if (!fk.values.inr_value || Number(fk.values.inr_value) <= 0) {
            toast.error("Please enter valid amount");
            return;
        }


    if (fk.values.inr_value < 5) {
        toast.error("Minimum transfer amount is $5", {id:1});
        return;
    }
        Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Do you want to proceed with the transfer?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, transfer it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                if (walletType === "spot") SpotWallet();
                else if (walletType === "profit") ProfitWallet();
            }
        });
    };

    return (
        <>
            <Header2 title={"Transfer"} historyRoute="/transfer-history" />

            <Box sx={{ minHeight: "100vh", color: "white", px: 3, pb: 14, pt: 4, position: "relative" }}>
                {/* Header with History icon top right */}

                <CustomCircularProgress isLoading={loading} />

                {/* From / To wallet block */}
                <Box sx={{ mb: 3, border: "1px solid gray", borderRadius: 2, overflow: "hidden" }}>
                    <Box
                        sx={{
                            px: 2,
                            py: 1.4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.5,
                        }}
                    >
                        <Typography sx={{ color: "#898989 !important", fontSize: 14 }}>From :</Typography>
                        <FormControl variant="standard">
                            <Select
                                value={walletType}
                                onChange={(e) => setWalletType(e.target.value)}
                                disableUnderline
                                IconComponent={() => null}
                                displayEmpty
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: "#000",
                                            color: "#fff",
                                            "& .MuiMenu-list": {
                                                py: 0.25,
                                            },
                                        },
                                    },
                                }}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}>
                                        <Typography sx={{ color: "white", fontSize: 14 }}>
                                            {selected
                                                ? selected === "spot"
                                                    ? "Spot"
                                                    : "Profit"
                                                : "Select"}
                                        </Typography>
                                        <KeyboardArrowDownIcon sx={{ color: "white", fontSize: 18 }} />
                                    </Box>
                                )}
                                sx={{
                                    color: "white",
                                    minWidth: 70,
                                    "& .MuiSelect-select": {
                                        color: "white",
                                        pr: "0px !important",
                                        py: "0px !important",
                                    },
                                }}
                            >
                                <MenuItem value="spot" sx={{ pl: 2, py: 0.5, minHeight: 32 }}>
                                    Spot
                                </MenuItem>
                                <MenuItem value="profit" sx={{ pl: 2, py: 0.5, minHeight: 32 }}>
                                    Profit
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            px: 2,
                            py: 1.4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 0.5,
                        }}
                    >
                        <Typography sx={{ color: "#898989 !important", fontSize: 14 }}>To :</Typography>
                        <FormControl variant="standard">
                            <Select
                                value="trade"
                                disabled
                                disableUnderline
                                IconComponent={() => null}
                                renderValue={() => (
                                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}>
                                        <Typography sx={{ color: "white", fontSize: 14 }}>Trade</Typography>
                                        <KeyboardArrowDownIcon sx={{ color: "white", fontSize: 18 }} />
                                    </Box>
                                )}
                                sx={{
                                    minWidth: 70,
                                    "&.Mui-disabled": {
                                        opacity: 1,
                                    },
                                    "&.Mui-disabled .MuiSelect-select": {
                                        color: "white",
                                        WebkitTextFillColor: "white",
                                        pr: "0px !important",
                                        py: "0px !important",
                                    },
                                }}
                            >
                                <MenuItem value="trade">Trade</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Asset Select (fixed to USDT) */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ color: "#808080" }}>Asset</InputLabel>
                    <Select
                        value="USDT"
                        label="Asset"
                        disabled
                        sx={{
                            color: "white",
                            "&.Mui-disabled": {
                                color: "white", // text color when disabled
                                WebkitTextFillColor: "white", // important for some browsers
                                opacity: 1, // remove default faded look
                            },
                            "&.Mui-disabled .MuiSelect-select": {
                                color: "white",
                                WebkitTextFillColor: "white",
                            },
                            "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                                borderColor: "gray",
                                opacity: 1,
                            },
                            "& .MuiSelect-icon": { color: "white" },
                            "& .MuiSelect-select": { color: "white" },
                        }}
                    >
                        <MenuItem value="USDT">USDT</MenuItem>
                    </Select>
                </FormControl>

                {/* Balance display */}
                <Typography variant="body2" sx={{ mb: 1, textAlign: "right", color: "#38bd1e", fontWeight: 600 }}>
                    {walletType === "profit"
                        ? `Profit Available: $${getFloatingValue(user?.tr03_inc_wallet) ?? "--"}`
                        : walletType === "spot"
                            ? `Spot Available: $${getFloatingValue(user?.tr03_fund_wallet) ?? "--"}`
                            : `Available Balance: $0.00`}
                </Typography>

                {/* Amount Input */}
                <TextField
                    label="Amount"
                    type="text"
                    value={fk.values.inr_value}
                    placeholder="0"
                    fullWidth
                    inputProps={{
                        inputMode: "numeric",
                    }}
                    onChange={(e) => {
                        let val = e.target.value;

                        if (/^\d*$/.test(val)) {
                            fk.setFieldValue("inr_value", val);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (["-", "+", "e", "E", "."].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    sx={{
                        mb: 4,
                        "& .MuiInputBase-input": {
                            color: "white",
                            WebkitTextFillColor: "white",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#808080",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#49eaff",
                        },
                        "& .MuiInputLabel-root.MuiFormLabel-filled": {
                            color: "#49f9ff",
                        },
                        "& input::placeholder": {
                            color: "#ccc",
                        },
                    }}
                />
                {/* Transfer Button */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{
                        background: "linear-gradient(90deg, #04fcf8, #fa0ef5)",
                        fontWeight: "bold",
                        fontSize: 16,
                        "&:hover": { bgcolor: "#090a0a" },
                    }}
                >
                    Transfer
                </Button>

                {/* Important Notices */}
                {walletType === "spot" && (
                    <Box sx={{ mt: 4, px: 2, color: "white" }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Important Notice
                        </Typography>
                        <Typography sx={{ fontSize: 13, mb: 1 }}>
                            1. First transfer from <b>Spot to Trade</b> must be a minimum of{" "}
                            <span style={{ color: "#22c55e" }}>$50</span>.
                        </Typography>
                        <Typography sx={{ fontSize: 13, mb: 1 }}>
                            2. After the first transfer, you can transfer as low as{" "}
                            <span style={{ color: "#22c55e" }}>$5</span>.
                        </Typography>
                        {/* <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>
                            3. First Deposit Bonus Structure:
                        </Typography>
                        <Box sx={{ border: "1px solid #333", borderRadius: 1, overflow: "hidden" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    bgcolor: "#1a1a1a",
                                    px: 2,
                                    py: 1,
                                    borderBottom: "1px solid #333",
                                }}
                            >
                                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Deposit Amount</Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Bonus</Typography>
                            </Box>
                            {[
                                { range: "$50 – $299", bonus: "+ $3" },
                                { range: "$300 – $999", bonus: "+ $10" },
                                { range: "$1000 – $4999", bonus: "+ $25" },
                                { range: "$5000 & above", bonus: "+ $100" },
                            ].map((row, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        px: 2,
                                        py: 1,
                                        borderBottom: idx !== 3 ? "1px solid #333" : "none",
                                        color: "#38bd1e",
                                    }}
                                >
                                    <Typography sx={{ fontSize: 13 }}>{row.range}</Typography>
                                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{row.bonus}</Typography>
                                </Box>
                            ))}
                        </Box> */}
                    </Box>
                )}

                {walletType === "profit" && (
                    <Box sx={{ mt: 4, px: 2, color: "white" }}>
                        <Typography variant="h6" gutterBottom>
                            Important Notice
                        </Typography>
                        <Typography sx={{ fontSize: 13 }}>
                            1. You can transfer a minimum of $5 to the Trade Wallet and get compounding benefits.
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
}