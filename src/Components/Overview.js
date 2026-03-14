import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, List, ListItem, ListItemButton, MenuItem, Select, Slider, Typography } from '@mui/material';
import { useState } from "react";
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import deposit from "../assets/images/icons/deposit.png";
import more from "../assets/images/icons/more.png";
import transfer from "../assets/images/icons/transfer.png";
import withdrawal from "../assets/images/icons/withdrawal.png";
import { apiConnectorGet, apiConnectorPost } from '../services/apiconnector';
import { endpoint } from '../services/urls';
import CustomCircularProgress from '../shared/loder/CustomCircularProgress';
import { getFloatingValue } from "../utils/utilityFun";


export default function Overview() {

    const [showBalance, setShowBalance] = useState(true);
    const client = useQueryClient();
    const [currency, setCurrency] = useState("USDT");
    const [loading, setloading] = useState(false);
    const MySwal = withReactContent(Swal);

    const { data: member, isLoading, } = useQuery(
        ["dashboard"],
        () => apiConnectorGet(endpoint?.member_details
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const user = member?.data?.result[0] || []

    const { data: dashboard_data } = useQuery(
        ["dashboard_data"],
        () => apiConnectorGet(endpoint?.member_dashboard
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const member_dashboard = dashboard_data?.data?.result || []

    // console.log("member_dashboard", member_dashboard)
    const { data: pnl_data } = useQuery(
        ["overview_pnl_data"],
        () => apiConnectorPost(endpoint?.get_overview_pnl_data, {
            pnl_type: "overview"
        }
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const pnl_data_ = pnl_data?.data?.result || [];



    const WalletClaimedFn = async (income_type) => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to claim this bonus?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, claim it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true,
            customClass: {
                icon: 'my-swal-icon',
                title: 'my-swal-title',
                content: 'my-swal-content',
                cancelButton: 'swal2-cancel-btn-red',
            }
        });

        if (result.isConfirmed) {
            try {
                setloading(true);
                const res = await apiConnectorPost(endpoint.claimed_income, { income_type });
                // toast(res?.data?.message);
                setloading(false);

                if (res?.data?.success) {

                    MySwal.fire({
                        title: 'Claimed!',
                        text: 'Your bonus has been claimed.',
                        icon: 'success',
                        customClass: {
                            title: 'swal-title-black'
                        }
                    });

                    client.refetchQueries("dashboard");
                    client.refetchQueries("dashboard_data");

                }
            } catch (e) {
                toast.error("Something went wrong");
                console.error(e);
            }
        } else {
            MySwal.fire({
                title: 'Cancelled',
                text: 'Your bonus was not claimed',
                icon: 'info',
                customClass: {
                    title: 'swal-title-black'
                }
            });

        }
        setloading(false);
    };

    const { data } = useQuery(
        ["get_total_member"],
        () => apiConnectorGet(endpoint?.get_total_member),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const level_member = data?.data?.result || []

    return (
        <>
            <style>
                {`
                .account_box > div {
    box-shadow: 0px 0px 5px 7px transparent;
    border-bottom: 1px solid #80808014;
    border-radius: 0 !important;
    padding-bottom: 7px;
}
                `}
            </style>
            <Container sx={{
                px: '15px !important',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <CustomCircularProgress isLoading={isLoading || loading} />
                <Box className="balance_heading">
                    <Typography variant='h6' sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        Total Assest
                        <Button
                            onClick={() => setShowBalance(!showBalance)}
                            sx={{ minWidth: "auto", color: "#fff" }}
                        >
                            <i className={showBalance ? "ri-eye-line" : "ri-eye-off-line"}></i>
                        </Button>
                    </Typography>

                    <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {showBalance
                            ? `$${getFloatingValue(Number(user?.tr03_inc_wallet || 0) + Number(user?.tr03_fund_wallet || 0))}`
                            : "$ ****"}

                        <Select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{ fontSize: "1.5rem", ml: 1 }}
                        >
                            <MenuItem value="USDT">USDT</MenuItem>
                        </Select>
                    </Typography>
                    <Typography variant="h6">
                        Today's PnL{" "}
                        <span style={{ color: "#38bd1e" }}>${getFloatingValue(pnl_data_?.[0]?.overview_pnl)} </span>{" "}
                        <i className="ri-arrow-drop-right-line"></i>
                    </Typography>
                </Box>
                <Box className="main_btne">
                    <List sx={{ marginTop: '5px !important' }}>

                        <ListItem>
                            <ListItemButton component={Link} to="/Deposit">
                                <Box component='img' src={deposit} alt="deposit"></Box>
                                <Typography>Deposit</Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/Withdrawal">
                                <Box component='img' src={withdrawal} alt="withdrawal"></Box>
                                <Typography>Withdrawal</Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/Transfer">
                                <Box component='img' src={transfer} alt="transfer"></Box>
                                <Typography>Transfer</Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/More">
                                <Box component='img' src={more} alt="more"></Box>
                                <Typography>More</Typography>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>

                <Box className="account_box" sx={{ mt: 2 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant='h6'>Claim Bonus</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: "0 !important" }}>
                            <List>
                                {[
                                    {
                                        label: "Trade Profit",
                                        type: "roi_bonus",
                                        amount: Number(user?.tr03_roi_bonus),
                                        color: "#9f41ec"   // Purple
                                    },
                                    {
                                        label: "Dividend",
                                        type: "td_level",
                                        amount: Number(user?.tr03_td_level),
                                        color: "#22c55e"   // Green
                                    },
                                    {
                                        label: "Community Trade",
                                        type: "rank_bonus",
                                        amount: Number(user?.tr03_rank_bonus),
                                        color: "#3b82f6"   // Blue
                                    }
                                ].map((item, index) => {

                                    const isClaimable = item.amount > 0;

                                    return (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >

                                            {/* Left Side with Different Color Ball */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: "50%",
                                                        backgroundColor: item.color
                                                    }}
                                                />
                                                <Typography>{item.label}</Typography>
                                            </Box>

                                            {/* Right Side */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Typography sx={{
                                                    color: `${item.color} !important`,
                                                }}>
                                                    ${getFloatingValue(item.amount)}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    onClick={() => WalletClaimedFn(item.type)}
                                                    disabled={!isClaimable}
                                                    disableRipple
                                                    disableFocusRipple
                                                    sx={{
                                                        minWidth: "80px",
                                                        backgroundColor: isClaimable ? "green" : "#777",
                                                        color: "#fff !important",
                                                        fontSize: "12px",
                                                        textTransform: "none",
                                                        "&:hover": {
                                                            backgroundColor: isClaimable ? "darkgreen" : "#777"
                                                        },
                                                        "&:focus": {
                                                            outline: "none"
                                                        }
                                                    }}
                                                >
                                                    {isClaimable ? "Claim" : "Claimed"}
                                                </Button>

                                                {/* <Button
                                                    size="small"
                                                    onClick={() => WalletClaimedFn(item.type)}
                                                    disabled={!isClaimable}
                                                    sx={{
                                                        minWidth: "80px",
                                                        backgroundColor: isClaimable ? "green" : "#777",
                                                        color: "#fff !important",
                                                        fontSize: "12px",
                                                        textTransform: "none",
                                                        "&:hover": {
                                                            backgroundColor: isClaimable ? "darkgreen" : "#777"
                                                        }
                                                    }}
                                                >
                                                    {isClaimable ? "Claim" : "Claimed"}
                                                </Button> */}
                                            </Box>

                                        </ListItem>
                                    );
                                })}


                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Box>


                {/* <Box
                    sx={{
                        p: 1,
                        px: 2,
                        m: 1,
                        mt: 2,
                        borderRadius: 1,
                        border: "1px solid #9f41ec",
                        background: "rgba(255,255,255,0.03)",
                    }}
                >
                    <Typography>Claim Bonus</Typography>
                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2, // thoda spacing between label/value/buttons
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                            <Typography sx={{ color: "#facc15", fontSize: "13px", fontWeight: "normal" }}>
                                Trade Profit Bonus
                            </Typography>
                            <Typography sx={{ color: "#facc15", fontSize: "13px", fontWeight: "normal" }}>
                                Dividend Bonus
                            </Typography>
                            <Typography sx={{ color: "#facc15", fontSize: "13px", fontWeight: "normal" }}>
                                Community Trade Bonus
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3, textAlign: "right" }}>
                             <Typography sx={{ color: "#fff", fontSize: "13px", fontWeight: "normal" }}>
                                $ {Number(user?.tr03_roi_bonus)?.toFixed(2)}
                            </Typography>
                            <Typography sx={{ color: "#fff", fontSize: "13px", fontWeight: "normal" }}>
                                $ {Number(user?.tr03_td_level)?.toFixed(2)}
                            </Typography>
                            <Typography sx={{ color: "#fff", fontSize: "13px", fontWeight: "normal" }}>
                                $ {Number(user?.tr03_rank_bonus)?.toFixed(2)}
                            </Typography>
                           
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            {[
                                { type: "roi_bonus", amount: Number(user?.tr03_roi_bonus) },
                                { type: "td_level", amount: Number(user?.tr03_td_level) },
                                { type: "rank_bonus", amount: Number(user?.tr03_rank_bonus) },
                                
                            ].map(({ type, amount }, idx) => (
                                <button
                                    key={idx}
                                    style={{
                                        backgroundColor: amount > 0 ? "#9f41ec" : "#aaa",
                                        color: amount > 0 ? "#fff" : "#fff",
                                        border: "none",
                                        padding: "4px 8px",
                                        borderRadius: "8px",
                                        cursor: amount > 0 ? "pointer" : "not-allowed",
                                        fontSize: "12px",
                                        fontWeight: "normal",
                                        lineHeight: 1,
                                        transition: "background-color 0.3s ease",
                                        textAlign: "center",
                                    }}
                                    disabled={amount <= 0}
                                    onClick={() => WalletClaimedFn(type)}
                                >
                                    Claim
                                </button>
                            ))}
                        </Box>

                    </Box>
                </Box> */}

                <Box className="account_box" sx={{ mt: 1 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant='h6'>Account</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: " 0 !important" }}>
                            <List>
                                {/* <ListItem>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <span></span>
                                        <Typography>Overview</Typography>
                                    </Box>
                                    <Box>
                                        ${member_dashboard?.total_income}
                                        <Typography variant='h6'>0.00%</Typography>
                                    </Box>
                                </ListItem> */}
                                <ListItem>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <span></span>
                                        <Typography>Spot</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "#3b82f6 !important" }}>${getFloatingValue(user?.tr03_fund_wallet)}</Typography>
                                        {/* <Typography variant='h6'>0.00%</Typography> */}
                                    </Box>
                                </ListItem>
                                <ListItem>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <span></span>
                                        <Typography>Trade</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "#facc15 !important" }}>${getFloatingValue(user?.tr03_topup_wallet)}</Typography>
                                        {/* <Typography variant='h6'>0.00%</Typography> */}
                                    </Box>
                                </ListItem>
                                <ListItem>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <span></span>
                                        <Typography>Earning</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "#22c55e !important" }}>${getFloatingValue(user?.tr03_inc_wallet)}</Typography>
                                        {/* <Typography variant='h6'>0.00%</Typography> */}
                                    </Box>
                                </ListItem>

                            </List>
                        </AccordionDetails>
                    </Accordion>


                </Box>


                <Box className="account_box" sx={{ mt: 1, }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Income</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <List>
                                {[
                                    { label: "Total Deposit", value: level_member?.total_deposit_from_qr, color: "#c743d8" },
                                    { label: "Total Earning", value: member_dashboard?.total_income, color: "#3b82f6" },
                                    { label: "Total Withdrawal", value: member_dashboard?.total_withdrawal, color: "#facc15" },
                                    { label: "Total Claimed", value: member_dashboard?.total_claimed, color: "#22c55e" },
                                    { label: "Today Earning", value: member_dashboard?.today_earning, color: "#ec4899" },
                                    { label: "Today Claimed", value: member_dashboard?.today_claimed, color: "#ef4444" },

                                ].map((item, index) => (
                                    <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span style={{ backgroundColor: item.color, width: 8, height: 8, borderRadius: "50%" }}></span>
                                            <Typography>{item.label}</Typography>
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: item.color,
                                                fontWeight: 500,
                                                "&.MuiTypography-root": {
                                                    color: `${item.color} !important`
                                                }
                                            }}
                                        >
                                            ${getFloatingValue(item.value)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box className="account_box" sx={{ mt: 1, mb: 7 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Earning & Limits</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <Box sx={{ border: "none", borderRadius: 1, pb: 1 }}>
                                <Slider
                                    value={Number(member_dashboard?.income_percent_received)}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    sx={{
                                        pointerEvents: "none",
                                        "& .MuiSlider-rail": {
                                            backgroundColor: "#808080",
                                            opacity: 1,
                                            height: 30,
                                            borderRadius: 0,
                                        },
                                        "& .MuiSlider-track": {
                                            backgroundColor: "#9f41ec",
                                            border: "none",
                                            height: 30,
                                            borderRadius: 0,
                                        },
                                        "& .MuiSlider-thumb": {
                                            display: "none",
                                        },
                                        "& .MuiSlider-valueLabel": {
                                            backgroundColor: "#9f41ec",
                                        },
                                        "& .MuiSlider-valueLabel:before": {
                                            display: "none",
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                                {[
                                    {
                                        label: "Completion",
                                        value: `${getFloatingValue(member_dashboard?.income_percent_received || 0)}%`,
                                        color: "#9f41ec"
                                    },
                                    {
                                        label: "Current Earning",
                                        value: `$${getFloatingValue(member_dashboard?.total_income_in_3_x || 0)}`,
                                        color: " #22c55e"
                                    },
                                    {
                                        label: "Earning Limit (3x)",
                                        value: `$${getFloatingValue(Number(member_dashboard?.trade_deposit || 0) * 3)}`,
                                        color: "#e92424 "
                                    },
                                    {
                                        label: "Remaining Limit",
                                        value: `$${getFloatingValue(Number(member_dashboard?.trade_deposit || 0) * 3 - Number(member_dashboard?.total_income_in_3_x || 0))}`,
                                        color: "#facc15"
                                    }
                                ].map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        {/* Left Side Dot + Label */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    backgroundColor: item.color
                                                }}
                                            />
                                            <Typography sx={{ fontSize: "14px !important" }}>
                                                {item.label}
                                            </Typography>
                                        </Box>

                                        {/* Right Side Colored Amount */}
                                        <Typography
                                            sx={{
                                                fontSize: "14px !important",
                                                color: `${item.color} !important`,
                                                fontWeight: 500
                                            }}
                                        >
                                            {item.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                {/* <Box className="account_box" sx={{ mt: 1, mb: 7 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Earning & Limits</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 2 }}>
                            <Box sx={{ border: "1px solid #fff", borderRadius: 1, px: 2, pt: 2, pb: 1 }}>
                                <Slider
                                    value={Number(member_dashboard?.income_percent_received || 0)}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    sx={{
                                        pointerEvents: "none",
                                        "& .MuiSlider-rail": {
                                            backgroundColor: "#808080",
                                            opacity: 1,
                                        },
                                        "& .MuiSlider-track": {
                                            backgroundColor: "#9f41ec",
                                            border: "none",
                                        },
                                        "& .MuiSlider-thumb": {
                                            backgroundColor: "#9f41ec",
                                            border: "2px solid #fff",
                                        },
                                        "& .MuiSlider-valueLabel": {
                                            backgroundColor: "#9f41ec",
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography sx={{ fontSize: "14px !important" }}>Completion:</Typography>
                                    <Typography sx={{ fontSize: "14px !important" }}>{getFloatingValue(member_dashboard?.income_percent_received || 0)}%</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography sx={{ fontSize: "14px !important" }}>Current Earning:</Typography>
                                    <Typography sx={{ fontSize: "14px !important" }}>${getFloatingValue(member_dashboard?.total_income_in_3_x || 0)}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography sx={{ fontSize: "14px !important" }}>Earning Limit(3X):</Typography>
                                    <Typography sx={{ fontSize: "14px !important" }}>${getFloatingValue(Number(member_dashboard?.trade_deposit || 0) * 3)}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                    <Typography sx={{ fontSize: "14px !important" }}>Remaining Limit:</Typography>
                                    <Typography sx={{ fontSize: "14px !important" }}>${getFloatingValue(Number(member_dashboard?.trade_deposit || 0) * 3 - Number(member_dashboard?.total_income_in_3_x || 0))}</Typography>
                                </Box>
                            </Box> */}
                        </AccordionDetails>
                    </Accordion>
                </Box>

            </Container>
        </>
    )
}

