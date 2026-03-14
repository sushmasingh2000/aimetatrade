import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import Header2 from "./Layouts/Header2";
import { useEffect, useState } from "react";
import CustomToPagination from "../shared/CustomPagination";
import { getFloatingValue } from "../utils/utilityFun";



export default function Level() {
    const [page, setPage] = useState(1);

    const { id } = useParams();

    const { data: level, isLoading } = useQuery(
        ["level_member", id, page],
        () => apiConnectorPost(endpoint?.get_member_downline, {
            level_id: id,
            page: page,
            count: 15
        }
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const level_wise = level?.data?.result || []

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header2 title={`Level ${id} Report`} />
            <CustomCircularProgress isLoading={isLoading} />
            <Container sx={{ padding: "15px !important", minHeight: " 100vh" }}>
                <Paper className="ruble" sx={{ mb: 10}}>
                    <TableContainer > {/* Only table scrolls */}
                        <Table stickyHeader>
                            <TableHead >
                                <TableRow>
                                    <TableCell component="th">S.No.</TableCell>
                                    <TableCell component="th">UID</TableCell>
                                    <TableCell component="th">SponID</TableCell>
                                    <TableCell component="th">Email</TableCell>
                                    <TableCell component="th">Amount</TableCell>
                                    <TableCell component="th">Rank</TableCell>
                                    <TableCell component="th">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {level_wise?.data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    level_wise?.data?.map((item, index) => (
                                        <TableRow key={item.tr03_cust_id || index}>
                                            <TableCell>{index + 1}</TableCell>

                                            <TableCell>{item?.tr03_cust_id}</TableCell>
                                            <TableCell>{item?.spon_cust_id|| "--"}</TableCell>

                                            <TableCell>
                                                {item?.lgn_email

                                                    ? `${item.lgn_email
                                                        .slice(0, 3)}...${item.lgn_email
                                                            .slice(-4)}`
                                                    : "--"} </TableCell>
                                            <TableCell   sx={{
                                                    color: item?.tr03_topup_date ? "#38bd1e !important" : "#ffffff !important",
                                                    fontWeight: "bold",
                                                }}>
                                                {getFloatingValue(item?.tr03_topup_wallet)}</TableCell>
                                            <TableCell> {item?.tr03_rank}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color: item?.tr03_topup_date ? "green !important" : "red !important",
                                                    fontWeight: "bold", // optional, thoda highlight ke liye
                                                }}
                                            >
                                                {item?.tr03_topup_date ? "Active" : "Inactive"}
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}


                            </TableBody>
                        </Table>
                    </TableContainer>
                    <CustomToPagination page={page} setPage={setPage} data={level_wise} />
                </Paper>
            </Container>

        </>
    );
}
