import {
    Box,
    Container,
    Select,
    Typography,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemButton
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import withdrawal from "../assets/images/icons/withdrawal.png";
import deposit from "../assets/images/icons/deposit.png";
import transfer from "../assets/images/icons/transfer.png";
import convert from "../assets/images/icons/convert.png";
import { useState } from "react";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import Trade from "./Trade";
import { getFloatingValue } from "../utils/utilityFun";

export default function Earning() {
    const [currency, setCurrency] = useState("USDT");
    const [showBalance, setShowBalance] = useState(true);

    const { data: dashboard_data } = useQuery(
        ["dashboard_data"],
        () => apiConnectorGet(endpoint?.member_dashboard),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true
        }
    );

    const member_dashboard = dashboard_data?.data?.result || {};

    const incomeList = [
        { title: "Trade Profit", path: "/trade_profit", price: member_dashboard?.roi, color: "#9f41ec" },
        { title: "Direct Partner Bonus", path: "/firstdeposit", price: member_dashboard?.direct, color: "#22c55e" },
        // { title: "Referral Level Bonus", path: "/everyDeposite", price: member_dashboard?.lev, color: "#3b82f6" },
        { title: "Dividend Bonus", path: "/dividentBonus", price: member_dashboard?.tp_lev, color: "#facc15" },
        { title: "Community Trade Bonus", path: "/differential_income", price: member_dashboard?.rnk, color: "#ec4899" },
        { title: "Rank-Up Bonus", path: "/weekly", price: member_dashboard?.weekly, color: "#f97316" },
        // { title: "Rank Reward", path: "/onetime", price: member_dashboard?.reward, color: "#14b8a6" },
        // { title: "Same Rank Bonus", path: "/same_rank", price: member_dashboard?.same_rank, color: "#a855f7" },
        { title: "MT Rank Bonus", path: "/partner", price: member_dashboard?.partner_rank, color: "#ef4444" }
    ];


    const navigate = useNavigate();


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
    const pnl_data_ = pnl_data?.data?.result || []
    return (
        <>
            <Container sx={{ px: "15px !important" }}>
                <Box className="balance_heading">
                    <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        Total Earning
                        <Button
                            onClick={() => setShowBalance(!showBalance)}
                            sx={{ minWidth: "auto", color: "#fff" }}
                        >
                            <i
                                className={
                                    showBalance ? "ri-eye-line" : "ri-eye-off-line"
                                }
                            ></i>
                        </Button>
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        {showBalance
                            ? `$${getFloatingValue(member_dashboard?.total_income)}`
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

                {/* ACTION BUTTONS */}
                <Box className="main_btne">
                    <List sx={{ marginTop: "5px !important" }}>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/Deposit">
                                <Box component="img" src={deposit} alt="deposit" />
                                <Typography ml={1}>Deposit</Typography>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/Withdrawal">
                                <Box component="img" src={withdrawal} alt="withdrawal" />
                                <Typography ml={1}>Withdrawal</Typography>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/Transfer">
                                <Box component="img" src={transfer} alt="transfer" />
                                <Typography ml={1}>Transfer</Typography>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/More">
                                <Box component="img" src={convert} alt="convert" />
                                <Typography ml={1}>More</Typography>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Container>

            {/* INCOME TYPES LIST */}
            <Container sx={{ px: 2, mt: 3, pb: 10 }}>
                <Typography
                    sx={{
                        fontSize: "15px !important",
                        color: "#a1a1a1",
                        fontWeight: 600,
                        mb: 2
                    }}
                >
                    History
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 1
                    }}
                >
                    {incomeList.map((item, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                if (item.path) navigate(item.path);
                            }}
                            sx={{
                                cursor: item.path ? "pointer" : "default",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                transition: "0.3s",
                                "&:hover": {
                                    background: "#222"
                                }
                            }}
                        >
                            {/* Left Section */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: item.color
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "14px",
                                        color: "#fff"
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>

                            {/* Right Section */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                    sx={{
                                        color: `${item.color} !important`,
                                            fontSize: "14px !important"
                                    }}
                                >
                                    ${getFloatingValue(item?.price)}
                                </Typography>

                                <ArrowForwardIosIcon
                                    sx={{ fontSize: 14, color: "#888" }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>

        </>
    );
}
