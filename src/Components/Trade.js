import { Box, Container, Select, Typography, MenuItem, Button, List, ListItem, ListItemButton, Tabs, Tab } from '@mui/material';
import { Link, useLocation } from "react-router-dom";
import withdrawal from "../assets/images/icons/withdrawal.png";
import deposit from "../assets/images/icons/deposit.png";
import transfer from "../assets/images/icons/transfer.png";
import convert from "../assets/images/icons/convert.png";
import { useEffect, useState } from "react";
import coin1 from "../assets/images/chart-icon/1.png";
import { useQuery } from 'react-query';
import { apiConnectorGet, apiConnectorPost } from '../services/apiconnector';
import { endpoint } from '../services/urls';
import moment from 'moment';
import CustomCircularProgress from '../shared/loder/CustomCircularProgress';
import { getFloatingValue } from '../utils/utilityFun';
import { formatedDate } from '../utils/DateTime';
import { CountdownTimer } from '../shared/Countdowntimer';


export default function Trade() {
    // const location = useLocation();
    // const tabFromState = location?.state?.tab;
    const [currency, setCurrency] = useState("USDT");
    const [showBalance, setShowBalance] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    // useEffect(() => {
    //     if (tabFromState === 2) {
    //         setTabValue(1);
    //     } else {
    //         setTabValue(0);
    //     }
    // }, [tabFromState]);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const { data: member, } = useQuery(
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

    const { data, isLoading } = useQuery(
        ["get_transaction_trade_history"],
        () =>
            apiConnectorPost(endpoint?.get_transaction_trade_history, {
                search: "",
                count: "100000000000"
            }),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true
        }
    );

    // ✅ Correct Data Path
    const transaction = data?.data?.result?.data || [];

    const { data: trade_transfer, } = useQuery(
        ["get_report_details_roi"],
        () => apiConnectorPost(endpoint?.get_report_details, {
            search: "",
            sub_label: 'ROI',
            count: "1000000000",
            main_label: 'IN',
        }),
        { refetchOnMount: false, refetchOnWindowFocus: true, refetchOnReconnect: true }
    );
    const trade_data = trade_transfer?.data?.result?.data || [];



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

    return (
        <>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1d1b1b' }}>
                <Container sx={{ px: '15px !important' }}>
                    <CustomCircularProgress isLoading={isLoading} />
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
                            {tabValue === 0 ?
                                <>
                                    {showBalance
                                        ? `$${getFloatingValue(user?.tr03_topup_wallet)}`
                                        : "$ ****"}
                                </> :
                                <>
                                    {showBalance
                                        ? `$${getFloatingValue(member_dashboard?.roi)}`
                                        : "$ ****"}
                                </>
                            }

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
                        {tabValue === 1 &&
                            <Typography variant="h6">
                                Today's PnL{" "}
                                <span style={{ color: "#38bd1e" }}>${getFloatingValue(member_dashboard?.today_claimed_roi)} </span>{" "}
                                <i className="ri-arrow-drop-right-line"></i>
                            </Typography>
                        }
                    </Box>
                    <Box className="main_btne">
                        <List sx={{ marginTop: '5px !important' }}>
                            <ListItem>
                                <ListItemButton component={Link} to="/Deposit">
                                    <Box component='img' src={deposit}  sx={{ filter: "hue-rotate(45deg)" }} alt="deposit"></Box>
                                    <Typography>Deposit</Typography>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/Withdrawal">
                                    <Box component='img' src={withdrawal}  sx={{ filter: "hue-rotate(45deg)" }} alt="withdrawal"></Box>
                                    <Typography>Withdrawal</Typography>
                                </ListItemButton>
                            </ListItem>

                            <ListItem>
                                <ListItemButton component={Link} to="/Transfer">
                                    <Box component='img' src={transfer} sx={{ filter: "hue-rotate(45deg)" }} alt="transfer"></Box>
                                    <Typography>Transfer</Typography>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/More">
                                    <Box component='img' src={convert}  sx={{ filter: "hue-rotate(45deg)" }} alt="convert"></Box>
                                    <Typography>More</Typography>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Container>
                <Box sx={{ mt: 3, px: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        TabIndicatorProps={{ style: { display: "none" } }}
                        sx={{
                            // background: "#1a1a2e",
                            borderRadius: "12px",
                            p: "4px",
                            minHeight: "auto",
                        }}
                    >
                        <Tab
                            label="Trade Deposit"
                            sx={{
                                flex: 1,   // ✅ equal width
                                textTransform: "none",
                                minHeight: "40px",
                                minWidth: 0,   // ✅ important for mobile
                                color: "#cfd8ff !important",
                                transition: "0.3s",
                                "&.Mui-selected": {
                                    background: "linear-gradient(90deg, #04fcf8, #fa0ef5)",
                                    color: "#fff !important",
                                },
                            }}
                        />
                        <Tab
                            label="Trade Profit"
                            sx={{
                                flex: 1,   // ✅ equal width
                                textTransform: "none",
                                minHeight: "40px",
                                minWidth: 0,   // ✅ important
                                color: "#cfd8ff !important",
                                transition: "0.3s",
                                "&.Mui-selected": {
                                    background: "linear-gradient(90deg, #04fcf8, #fa0ef5)",
                                    color: "#fff !important",
                                },
                            }}
                        />
                    </Tabs>

                    <Box sx={{ mt: 3 }}>
                        {tabValue === 0 && <Container sx={{ px: '0px !important' }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, px: '15px !important' }}>
                                <Typography sx={{ fontSize: "13px", color: "#a1a1a1 !important" }}>Assets</Typography>
                                <Typography sx={{ fontSize: "13px", color: "#a1a1a1 !important" }}>Amount</Typography>
                            </Box>
                            <Box className="Liast_assets" sx={{ mt: 2, pb: 8 }}>
                                <List>
                                    {transaction?.length > 0 ? (
                                        transaction?.map((item, index) => {
                                            return (
                                                <ListItem
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderBottom: "1px solid #1e1e1e",
                                                        py: 1.5
                                                    }}
                                                >
                                                    {/* LEFT SIDE */}
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Box component="img" src={coin1} alt="coin" sx={{ width: 35 }} />
                                                        <Box>
                                                            <Box sx={{ display: "flex", gap: "5px" }}>

                                                                <Typography sx={{ fontSize: "10px !important", color: "#888 !important" }}>
                                                                    {formatedDate(moment, item.tr09_created_at)}</Typography>
                                                            </Box>
                                                            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                                                From: {item?.tr09_through}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "12px", color: "#888" }}>
                                                                ID: {item.tr09_trans_id}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <CountdownTimer startDate={item.tr09_created_at} />
                                                    {/* RIGHT SIDE */}
                                                    <Box sx={{ textAlign: "right" }}>
                                                        <Typography
                                                            sx={{
                                                                color: "#38bd1e !important", fontSize: "15px !important"

                                                            }}
                                                        >
                                                            ${getFloatingValue(item.tr09_real_amount)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "12px", color: "#22c55e !important" }}>
                                                            SUCCESS

                                                        </Typography>
                                                    </Box>
                                                </ListItem>
                                            );
                                        })
                                    ) : (
                                        <Typography sx={{ textAlign: "center", mt: 3 }}>
                                            No Trade Deposit Found
                                        </Typography>
                                    )}
                                </List>
                            </Box>
                        </Container>}
                        {tabValue === 1 && <Container sx={{ px: '0px !important' }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, px: '15px !important' }}>
                                <Typography sx={{ fontSize: "13px", color: "#a1a1a1 !important" }}>Assets</Typography>
                                <Typography sx={{ fontSize: "13px", color: "#a1a1a1 !important" }}>Amount</Typography>
                            </Box>
                            <Box className="Liast_assets" sx={{ mt: 2, pb: 8 }}>
                                <List>
                                    {trade_data?.length > 0 ? (
                                        trade_data?.map((item, index) => {
                                            return (
                                                <ListItem
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderBottom: "1px solid #1e1e1e",
                                                        py: 1.5
                                                    }}
                                                >
                                                    {/* LEFT SIDE */}
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Box component="img" src={coin1} alt="coin" sx={{ width: 35 }} />
                                                        <Box>
                                                            <Box sx={{ display: "flex", gap: "5px" }}>

                                                                <Typography sx={{ fontSize: "10px !important", color: "#888 !important" }}>
                                                                    {formatedDate(moment, item.tr07_created_at)}</Typography>
                                                            </Box>
                                                            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                                                Trade Profit
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "12px", color: "#888" }}>
                                                                ID: {item.tr07_trans_id}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* RIGHT SIDE */}
                                                    <Box sx={{ textAlign: "right" }}>
                                                        <Typography
                                                            sx={{
                                                                color: "#38bd1e !important", fontSize: "15px !important"

                                                            }}
                                                        >
                                                            ${getFloatingValue(item.tr07_tr_amount)}
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontSize: "12px", color:
                                                                Number(item?.tr07_status) == 1
                                                                    ? "#22c55e !important"
                                                                    : "#facc15 !important"
                                                        }}>
                                                            {item?.tr07_status == 1 ? "Claimed" : "Unclaimed"}

                                                        </Typography>
                                                    </Box>
                                                </ListItem>
                                            );
                                        })
                                    ) : (
                                        <Typography sx={{ textAlign: "center", mt: 3 }}>
                                            No Trade Profit Found
                                        </Typography>
                                    )}
                                </List>
                            </Box>
                        </Container>}
                    </Box>
                </Box>

            </Box>
        </>
    )
}