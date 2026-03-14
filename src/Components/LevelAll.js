import {
    Box,
    Container,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import Header2 from "./Layouts/Header2";
import { useEffect, useMemo, useState } from "react";
import { getFloatingValue } from "../utils/utilityFun";
import toast from "react-hot-toast";



export default function AllLevel() {

    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const [amountFilter, setAmountFilter] = useState("");
    const [rankFilter, setRankFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const { data: level, isLoading } = useQuery(
        ["get_level_wise_tree"],
        () => apiConnectorGet(endpoint?.get_level_wise_tree),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const level_wise = level?.data?.result || []

    const filteredData = useMemo(() => {
        return level_wise.filter((item) => {
            const status = item?.tr03_topup_date ? "Active" : "Inactive";

            return (
                (
                    String(item?.tr03_cust_id || "")
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    String(item?.lgn_email || "")
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    String(item?.tr03_topup_wallet || "")
                        .includes(search) ||

                    String(item?.tr03_rank || "")
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    status.toLowerCase().includes(search.toLowerCase())
                )

                && (levelFilter ? String(item?.level_id) === String(levelFilter) : true)

                && (amountFilter ? Number(item?.tr03_topup_wallet) >= Number(amountFilter) : true)

                && (rankFilter ? String(item?.tr03_rank) === String(rankFilter) : true)

                && (statusFilter ? status === statusFilter : true)
            );
        });
    }, [level_wise, search, levelFilter, amountFilter, rankFilter, statusFilter]);

    const { data: member } = useQuery(
        ["get_total_member"],
        () => apiConnectorGet(endpoint?.get_total_member),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const level_member = member?.data?.result || []

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header2 title={"Team Members"} />
            <CustomCircularProgress isLoading={isLoading} />
            <Container sx={{ padding: "15px !important", minHeight: " 100vh" }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2, }}>

                    {/* Search */}
                    <TextField
                        sx={{
                            width: "100%",

                            "& .MuiInputBase-input": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiInputLabel-root": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiSelect-select": {
                                fontSize: "12px",
                                color: "#974aed"
                            },
                             "& .MuiInputLabel-root.Mui-focused": {
                                color: "#974aed", // label color on focus
                            },

                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "#974aed" },
                            },

                            "& .MuiSvgIcon-root": {
                                color: "white",
                            },
                        }}
                        label="Search (UID, Email, Amount)"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>

                {/* Level Filter */}
                <Box sx={{ display: "flex", gap: 2, mb: 2, }}>
                    <TextField
                        select
                        label="Level"
                        size="small"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        sx={{
                            width: "100%",

                            "& .MuiInputBase-input": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiInputLabel-root": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#974aed", // label color on focus
                            },

                            "& .MuiSelect-select": {
                                fontSize: "12px",
                                color: "#974aed",
                            },

                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "#974aed" },
                            },

                            "& .MuiSvgIcon-root": {
                                color: "white",
                            },
                        }}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        bgcolor: "#1e1e1e",
                                        color: "white",
                                        maxHeight: 300,
                                        px: 1,
                                        fontSize: "12px",
                                        // 👈 overall dropdown padding

                                        "& .MuiMenuItem-root": {
                                            color: "white",
                                            // 👈 vertical padding
                                            px: 2,     // 👈 horizontal padding
                                            borderRadius: 1,
                                            fontSize: "12px",
                                            minHeight: 28,
                                        },
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {[...new Set(level_wise.map(item => item.level_id))].map(level => (
                            <MenuItem key={level} value={level} >Level {level}</MenuItem>
                        ))}
                    </TextField>

                    {/* Rank Filter */}
                    <TextField
                        sx={{
                            width: "100%",

                            "& .MuiInputBase-input": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiInputLabel-root": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#974aed", // label color on focus
                            },

                            "& .MuiSelect-select": {
                                fontSize: "12px",
                                color: "#974aed",
                            },

                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "#974aed" },
                            },

                            "& .MuiSvgIcon-root": {
                                color: "white",
                            },
                        }}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        bgcolor: "#1e1e1e",
                                        color: "white",
                                        maxHeight: 300,
                                        px: 1,   // 👈 overall dropdown padding
                                        fontSize: "12px",
                                        "& .MuiMenuItem-root": {
                                            color: "white",
                                            // 👈 vertical padding
                                            px: 2,     // 👈 horizontal padding
                                            borderRadius: 1,
                                            fontSize: "12px",
                                            minHeight: 28,
                                        },
                                    }
                                }
                            }
                        }}
                        select
                        label="Rank"
                        size="small"
                        value={rankFilter}
                        onChange={(e) => setRankFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {[...new Set(level_wise.map(item => item.tr03_rank))].map(rank => (
                            <MenuItem key={rank} value={rank}>{rank}</MenuItem>
                        ))}
                    </TextField>

                    {/* Status Filter */}
                    <TextField
                        sx={{
                            width: "100%",

                            "& .MuiInputBase-input": {
                                fontSize: "12px",
                                color: "white",
                            },

                            "& .MuiInputLabel-root": {
                                fontSize: "12px",
                                color: "white",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#974aed", // label color on focus
                            },

                            "& .MuiSelect-select": {
                                fontSize: "12px",
                                color: "#974aed",
                            },


                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "#974aed" },
                            },

                            "& .MuiSvgIcon-root": {
                                color: "white",
                            },
                        }}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        bgcolor: "#1e1e1e",
                                        color: "white",
                                        maxHeight: 300,
                                        px: 1,   // 👈 overall dropdown padding
                                        fontSize: "12px",
                                        "& .MuiMenuItem-root": {
                                            color: "white",
                                            // 👈 vertical padding
                                            px: 2,     // 👈 horizontal padding
                                            borderRadius: 1,
                                            fontSize: "12px",
                                            minHeight: 28,
                                        },
                                    }
                                }
                            }
                        }}
                        select
                        label="Status"
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", p: "1px", px: 2, pb: 1 }}>
                    <Typography sx={{ color: "white", fontSize: "12px" }}>Total: {level_member?.total_team_member || 0}</Typography>
                    <Typography sx={{ color: "white", fontSize: "12px" }}>Active: <span style={{ color: "#28ce30 " }}>{level_member?.total_active_team_member || 0}</span></Typography>
                    <Typography sx={{ color: "white", fontSize: "12px" }}>InActive: <span style={{ color: "#e22222 " }}>{level_member?.total_team_member - level_member?.total_active_team_member || 0}</span>
                    </Typography>
                </Box>
                <Paper className="ruble" sx={{ mb: 10 }}>
                    <TableContainer > {/* Only table scrolls */}
                        <Table stickyHeader>
                            <TableHead >
                                <TableRow>
                                    <TableCell component="th">Level</TableCell>
                                    <TableCell component="th">UID</TableCell>
                                    <TableCell component="th">Email</TableCell>
                                    <TableCell component="th">Amount</TableCell>
                                    <TableCell component="th">Rank</TableCell>
                                    <TableCell component="th">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData?.map((item,) => (
                                        <TableRow key={item.tr03_cust_id}>
                                            <TableCell> {item?.level_id}</TableCell>

                                            <TableCell>{item?.tr03_cust_id}</TableCell>
                                            <TableCell>
                                                {item?.lgn_email

                                                    ? `${item.lgn_email
                                                        .slice(0, 3)}...${item.lgn_email
                                                            .slice(-4)}`
                                                    : "--"} </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: item?.tr03_topup_date ? "#38bd1e !important" : "#ffffff !important",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {getFloatingValue(item?.tr03_topup_wallet)}</TableCell>
                                            <TableCell> {item?.tr03_rank || "--"}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color: item?.tr03_topup_date ? "green !important" : "red !important",
                                                    fontWeight: "bold",
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
                </Paper>
            </Container>

        </>
    );
}
