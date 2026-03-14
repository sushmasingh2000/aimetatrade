import { Box, Container, Select, Typography, MenuItem, Button, List, ListItem, ListItemButton, Tabs, Tab } from '@mui/material';
import { Link } from "react-router-dom";
import withdrawal from "../assets/images/icons/withdrawal.png";
import deposit from "../assets/images/icons/deposit.png";
import transfer from "../assets/images/icons/transfer.png";
import convert from "../assets/images/icons/convert.png";
import { useState } from "react";
import coin1 from "../assets/images/chart-icon/1.png";
import { useQuery, useQueryClient } from 'react-query';
import { apiConnectorGet, apiConnectorPost } from '../services/apiconnector';
import { endpoint } from '../services/urls';
import moment from 'moment/moment';
import CustomCircularProgress from '../shared/loder/CustomCircularProgress';
import Swal from 'sweetalert2';
import { getFloatingValue } from '../utils/utilityFun';
import { formatedDate } from '../utils/DateTime';

export default function Spot() {
    const [currency, setCurrency] = useState("USDT");
    const [showBalance, setShowBalance] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [loding, setloading] = useState(false)
    const client = useQueryClient();
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 2) {
            fetchSpotWithdraw(); // ✅ Refetch Spot Withdrawal
        }
    };

    const { data: member } = useQuery(
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

    const { data, isLoading: loading } = useQuery(
        ["get_transaction_history"],
        () => apiConnectorPost(endpoint?.get_transaction_history, { search: "", is_claimed: true }),
        { refetchOnMount: false, refetchOnWindowFocus: true, refetchOnReconnect: true }
    );
    const transaction = data?.data?.result?.data || [];

    const { data: spot_transfer, } = useQuery(
        ["get_report_details_spot"],
        () => apiConnectorPost(endpoint?.get_report_details, {
            search: "",
            count: "10000000000000000",
            sub_label: 'SPOT WALLET',
            main_label: 'OUT',
        }),
        { refetchOnMount: false, refetchOnWindowFocus: true, refetchOnReconnect: true }
    );
    const spot_data = spot_transfer?.data?.result || [];

    // Spot Withdrawal API
    const { data: spot_withdraw, refetch: fetchSpotWithdraw } = useQuery(
        ["spot_withdrawal", tabValue],
        () =>
            apiConnectorPost(endpoint?.member_payout_report, {
                search: "",
                count: "10000000000000000",
                wallet_type: "spot_withdrawal", // ✅ Correct wallet_type
            }),
        {
            enabled: tabValue === 2, // ✅ only fetch when tabValue is 2 (Spot Withdrawal)
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const spot_withdrawal = spot_withdraw?.data?.result || [];

    const ClaimFn = async (transaction) => {

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to claim this deposit?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#17B15E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Claim it!',
            customClass: {
                icon: 'my-swal-icon',
                title: 'my-swal-title',
                content: 'my-swal-content',
                cancelButton: 'swal2-cancel-btn-red',
            }
        });

        if (result.isConfirmed) {
            setloading(true);
            try {

                const res = await apiConnectorPost(endpoint?.claim_deposit, {
                    trans_id: transaction
                });
                setloading(false)
                if (res?.data?.success) {
                    client.refetchQueries("get_transaction_history")
                    await Swal.fire({
                        icon: 'success',
                        title: 'Claimed!',
                        text: res?.data?.msg || "Deposit claimed successfully",
                        confirmButtonColor: '#17B15E'
                    });

                } else {
                    setloading(false)

                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: res?.data?.msg || "Claim failed",
                    });

                }

            } catch (error) {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });

            }
        }
    };


    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1d1b1b' }}>
            {/* TOP SECTION */}
            <Container sx={{ px: '15px !important' }}>
                <CustomCircularProgress isLoading={loading || loding} />
                <Box className="balance_heading" >
                    <Typography variant='h6' sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        Total Assest
                        <Button onClick={() => setShowBalance(!showBalance)} sx={{ minWidth: "auto", color: "#fff" }}>
                            <i className={showBalance ? "ri-eye-line" : "ri-eye-off-line"}></i>
                        </Button>
                    </Typography>

                    <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {showBalance ? `$${getFloatingValue(user?.tr03_fund_wallet )}` : "$ ****"}
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
                    {/* <Typography variant="h6">
                        Today's PnL{" "}
                        <span>$ {"0.00"} </span>{" "}
                        <i className="ri-arrow-drop-right-line"></i>
                    </Typography> */}
                </Box>

                {/* ACTION BUTTONS */}
                <Box className="main_btne">
                    <List sx={{ marginTop: '5px !important', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <ListItem sx={{ width: 'auto' }}>
                            <ListItemButton component={Link} to="/Deposit">
                                <Box component='img' src={deposit} alt="deposit" />
                                <Typography ml={1}>Deposit</Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ width: 'auto' }}>
                            <ListItemButton component={Link} to="/Withdrawal">
                                <Box component='img' src={withdrawal} alt="withdrawal" />
                                <Typography ml={1}>Withdrawal</Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ width: 'auto' }}>
                            <ListItemButton component={Link} to="/Transfer">
                                <Box component='img' src={transfer} alt="transfer" />
                                <Typography ml={1}>Transfer</Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ width: 'auto' }}>
                            <ListItemButton component={Link} to="/More">
                                <Box component='img' src={convert} alt="convert" />
                                <Typography ml={1}>More</Typography>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Container>
            <Box sx={{ mt: 1, px: 1 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    TabIndicatorProps={{ style: { display: "none" } }}
                    sx={{
                        // background: "#1a1a2e",
                        borderRadius: "12px",
                        p: "4px",
                        // minHeight: "auto",
                    }}
                >
                    <Tab
                        label="Spot Deposit"
                        sx={{
                            flex: 1,
                            textTransform: "none",
                            fontSize: "12px !important",
                            minHeight: "40px",
                            minWidth: 0,
                            color: "#cfd8ff !important",
                            transition: "0.3s",
                            "&.Mui-selected": {
                                background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                                color: "#fff !important",
                            },
                        }}
                    />
                    <Tab
                        label="Spot Transfer"
                        sx={{
                            flex: 1,
                            fontSize: "12px !important",
                            textTransform: "none",
                            minHeight: "40px",
                            minWidth: 0,
                            color: "#cfd8ff !important",
                            transition: "0.3s",
                            "&.Mui-selected": {
                                background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                                color: "#fff !important",
                            },
                        }}
                    />
                    <Tab
                        label="Spot Withdrawal"
                        sx={{
                            flex: 1,   // ✅ equal width
                            textTransform: "none",
                            fontSize: "12px !important",
                            minHeight: "40px",
                            minWidth: 0,   // ✅ important
                            color: "#cfd8ff !important",
                            transition: "0.3s",
                            "&.Mui-selected": {
                                background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                                color: "#fff !important",
                            },
                        }}
                    />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {tabValue === 0 &&
                        <Container sx={{ flex: 1, px: '0px !important', mt: 3, overflowY: 'auto' }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: '15px !important', mb: 1, mt: "-2px !important" }}>
                                <Typography sx={{ fontSize: "13px", color: "#a1a1a1" }}>Assets</Typography>
                                <Typography sx={{ fontSize: "13px", color: "#a1a1a1" }}>Amount</Typography>
                            </Box>
                            <Box className="Liast_assets" sx={{ mt: 2, pb: 8 }}>
                                <List>
                                    {transaction?.length > 0 ? (
                                        transaction?.map((item, index) => (
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
                                                        <Typography sx={{ color: "#888 !important" }}>
                                                            {formatedDate(moment ,item.tr_created_at)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "14px", }}>
                                                            Spot Deposit
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "14px", }}>
                                                            {item?.tr_trans_id}
                                                        </Typography>

                                                        <Typography sx={{ fontSize: "11px !important", }}>
                                                            {item?.tr_from_wallet

                                                                ? `${item.tr_from_wallet
                                                                    .slice(0, 12)}...${item.tr_from_wallet
                                                                        .slice(-4)}`
                                                                : "--"}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                color: "#888 !important",
                                                                cursor: "pointer",
                                                                textDecoration: "underline",
                                                            }}
                                                            onClick={() =>
                                                                item?.tr_hex_code && window.open(
                                                                    `https://bscscan.com/tx/${item.tr_hex_code
                                                                    }`,
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            {item?.tr_hex_code

                                                                ? `${item.tr_hex_code
                                                                    .slice(0, 12)}...${item.tr_hex_code
                                                                        .slice(-4)}`
                                                                : "--"}
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
                                                        ${getFloatingValue(item.tr_amount)}
                                                    </Typography>
                                                    {(item.tr_status === "Pending" || !item.tr_status) ?
                                                        <Button
                                                            variant='contained'
                                                            size='small'
                                                            onClick={() => ClaimFn(item?.m06_trans_id)}
                                                        >
                                                            Claim
                                                        </Button>

                                                        :
                                                        <Typography sx={{ fontSize: "12px", color: "#44d10d !important" }}>
                                                            {item.tr_status === "Success" ? "SUCCESS" : item.tr_status}</Typography>
                                                    }

                                                </Box>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography sx={{ textAlign: "center", mt: 3 }}>No Spot Deposit Found</Typography>
                                    )}
                                </List>
                            </Box>
                        </Container>}
                    {tabValue === 1 && <Container sx={{ flex: 1, px: '0px !important', mt: 3, overflowY: 'auto' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: '15px !important', mb: 1 }}>
                            <Typography sx={{ fontSize: "13px", color: "#a1a1a1" }}>Assets</Typography>
                            <Typography sx={{ fontSize: "13px", color: "#a1a1a1" }}>Amount</Typography>
                        </Box>
                        <Box className="Liast_assets" sx={{ mt: 2, pb: 8 }}>
                            <List>
                                {spot_data?.data?.length > 0 ? (
                                    spot_data?.data?.map((item, index) => (
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
                                                                 {formatedDate(moment ,item.tr07_created_at)}</Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                                        Spot Transfer
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "12px", color: "#888" }}>
                                                        {item.tr07_trans_id}
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
                                                <Typography sx={{ fontSize: "12px", color: "#22c55e !important" }}>SUCCESS</Typography>
                                            </Box>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography sx={{ textAlign: "center", mt: 3 }}>No Spot Transfer Found</Typography>
                                )}
                            </List>
                        </Box>
                    </Container>}
                    {tabValue === 2 && <Container sx={{ flex: 1, px: '0px !important', mt: 3, overflowY: 'auto' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: '15px !important', mb: 1 }}>
                            <Typography sx={{ fontSize: "13px", color: "#a1a1a1" }}>Assets</Typography>
                            <Typography sx={{ fontSize: "13px", color: "#a1a1a1" }}>Amount</Typography>
                        </Box>
                        <Box className="Liast_assets" sx={{ mt: 2, pb: 8 }}>
                            <List>
                                {spot_withdrawal?.data?.length > 0 ? (
                                    spot_withdrawal?.data?.map((item, index) => (
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
                                                    <Typography sx={{ fontSize: "12px", color: "#888" }}>
                                                     {formatedDate(moment ,item.tr11_created_at)}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                                        Spot Withdrawal
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "12px", color: "#888" }}>
                                                        {item.tr11_payout_to.slice(0, 6)}...{item.tr11_payout_to.slice(-4)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* RIGHT SIDE */}
                                            <Box sx={{ textAlign: "right" }}>
                                                <Typography
                                                    sx={{
                                                        color: "#38bd1e !important",
                                                    }}
                                                >
                                                    ${getFloatingValue(item.tr11_amont )}
                                                </Typography>
                                                {item.tr07_status === 1 ?
                                                    <Typography sx={{ fontSize: "12px", color: "#22c55e !important" }}>SUCCESS</Typography>
                                                    :
                                                    <Typography sx={{ fontSize: "12px" }}>Pending</Typography>
                                                }
                                                <Typography
                                                    sx={{ fontSize: "10px !important", mt: 2, cursor: "pointer" }}
                                                    onClick={() => item?.tr11_hash && window.open(`https://bscscan.com/tx/${item.tr11_hash}`, "_blank")}
                                                >
                                                    {/* {item?.tr11_hash} */}
                                                    {item?.tr11_hash

                                                        ? `${item.tr11_hash
                                                            .slice(0, 12)}...${item.tr11_hash
                                                                .slice(-4)}`
                                                        : "--"}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography sx={{ textAlign: "center", mt: 3 }}>No Spot Withdrawal Found</Typography>
                                )}
                            </List>
                        </Box>
                    </Container>}
                </Box>
            </Box>
            {/* TRANSACTION LIST */}

        </Box>
    );
}
