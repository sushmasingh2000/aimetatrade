import {
    Box,
    Container,
    ListItem,
    Stack,
    Typography
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { List } from "react-vant";
import { apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import { formatedDate } from "../utils/DateTime";
import { getFloatingValue } from "../utils/utilityFun";
import Header2 from "./Layouts/Header2";
import CustomToPagination from "../shared/CustomPagination";

function TransferHistory() {
    const [page, setPage] = useState(1);

    const { data: transferData, isLoading } = useQuery(
        ["get_report_details", page],
        () =>
            apiConnectorPost(endpoint?.get_transaction_trade_history, {
                search: "",
                count: "15",
                page: page,
            }),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );

    const trade_data = transferData?.data?.result || [];

    return (
        <>
            <Header2 title="Transfer History" />
            <CustomCircularProgress isLoading={isLoading} />

            <Container sx={{ px: '0px !important' }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, px: '15px !important' }}>
                    <Typography sx={{ fontSize: "13px", color: "#a1a1a1 !important" }}>Assets</Typography>
                    <Typography sx={{ fontSize: "13px", color: "#a1a1a1 !important" }}>Amount</Typography>
                </Box>
                <Box className="Liast_assets" sx={{ my: 2, pb: 8 }}>
                    <List>
                        {trade_data?.data?.length > 0 ? (
                            trade_data?.data?.map((item, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottom: "1px solid #fff",
                                            backgroundColor: index % 2 === 0 ? "#111" : "#181818",
                                            py: 1.5
                                        }}
                                    >
                                        {/* LEFT SIDE */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, m: 1 }}>
                                            {/* <Box component="img" src={coin1} alt="coin" sx={{ width: 35 }} /> */}
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

                                        {/* RIGHT SIDE */}
                                        <Box sx={{ textAlign: "right", mr: 1 }}>
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
                                No Transfer History Found
                            </Typography>
                        )}
                    </List>
                </Box>
                <CustomToPagination setPage={setPage} data={trade_data} page={page} />
            </Container>
        </>
    );
}

export default TransferHistory;

// Reusable Info Row
const InfoRow = ({ label, value, colorValue }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" >
        <Typography sx={{ ...infoLabel }}>{label}</Typography>
        <Typography sx={{ ...infoValue, color: colorValue || infoValue.color }}>{value}</Typography>
    </Stack>
);

const infoLabel = {
    color: "#888",
    fontSize: "13px",
    fontWeight: 600,
};

const infoValue = {
    fontSize: "13px",
    fontWeight: 600,
};

const style = {
    paytmbtntwo: {
        borderRadius: "20px",
        textTransform: "capitalize",
        mb: 4,
        width: "92%",
        mt: 2,
        mx: "auto",
        px: 2,
        py: 1.5,
        "&:hover": { border: "1px solid transparent" },
        color: "#fff",
        borderColor: "#fff",
    },
};
