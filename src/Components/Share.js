import React from "react";
import Header2 from "./Layouts/Header2";
import {
    Box,
    Typography,
    Button,
    Container,
    List,
    ListItem,
    TableHead,
    Paper,
    TableRow,
    TableCell,
    TableBody,
    Table

} from "@mui/material";
import scanner from "../assets/images/scanner.png";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint, front_end_domain } from "../services/urls";
import toast from "react-hot-toast";
import copy from 'clipboard-copy';
import QRCode from 'react-qr-code';
import { useNavigate } from "react-router-dom";
import { getFloatingValue } from "../utils/utilityFun";



export default function Share() {

    const { data } = useQuery(
        ["dashboard"],
        () => apiConnectorGet(endpoint?.member_details
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const user = data?.data?.result[0] || []

    const functionTOCopy = (value) => {
        copy(value);
        toast('Copied to clipboard!', { id: 1 });
    };

    return (
        <>
            <Header2 />

            <Container sx={{ padding: "15px !important" }}>
                <Box className="share_code">
                    <Box className="scanner_img">
                        <QRCode className="qrr"
                            value={`${front_end_domain}/register?ref=${user?.tr03_cust_id}`}
                            size={160}
                            level="H"
                        />
                    </Box>
                    <List sx={{ mt: 4 }}>
                        <ListItem>
                            <Typography>My Invitation code:</Typography>
                            <Typography><span>{user?.tr03_cust_id}</span>
                                {/* <Button onClick={() => {
                                                  functionTOCopy(
                                                      `${user?.tr03_cust_id}`
                                                  );
                                              }}><i class="ri-file-copy-2-line"></i></Button> */}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>My Invitation Link With Code: </Typography>

                        </ListItem>
                        <Typography sx={{ fontSize: "12px", color: "#aaa !important" }}>
                            <span>
                                {`${front_end_domain}/register/?ref=${user?.tr03_cust_id}`}
                            </span>
                            {/* <Button onClick={() => {
                                functionTOCopy(
                                    `${front_end_domain}/register/?ref=${user?.tr03_cust_id}`
                                );
                            }}><i class="ri-file-copy-2-line"></i></Button> */}
                        </Typography>
                        <Button variant="text" className="main_btn" onClick={() => {
                            functionTOCopy(
                                `Registration Link:\n${front_end_domain}/register/?ref=${user.tr03_cust_id}`
                            );
                        }}>Copy Invitation Link Here</Button>
                    </List>
                </Box>
                <Box className="Rule_box">
                    <Typography>Recommended number of people:</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            justifyItems: "start",
                        }}
                    >
                        <Typography> Direct Member's: {user?.tr03_dir_mem || 0}</Typography>
                        <Typography>
                            {" "}
                            Direct Bussiness: ${getFloatingValue(user?.tr03_dir_buss ) }
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            justifyItems: "start",
                        }}
                    >
                        <Typography> Team Member's: {user?.tr03_team_mem || 0}</Typography>
                        <Typography>
                            Team Bussiness: ${getFloatingValue(user?.tr03_team_buss )}
                        </Typography>
                    </Box>
                </Box>
            </Container>


            <Container sx={{ padding: "15px !important", mb: 8 }}>
                <Paper className="ruble" sx={{ mb: 0 }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell component="th">Team Level</TableCell>
                                <TableCell component="th">Require</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* <TableRow>
                                <TableCell>LV0</TableCell>
                                <TableCell>0 ≤ N＜ 0</TableCell>
                            </TableRow> */}
                            <TableRow>
                                <TableCell>LV1</TableCell>
                                <TableCell>0 ≤ N＜ 1</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV2</TableCell>
                                <TableCell>1 ≤ N＜ 2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV3</TableCell>
                                <TableCell>2 ≤ N＜ 3</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV4</TableCell>
                                <TableCell>R1</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV5</TableCell>
                                <TableCell>R1</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV6</TableCell>
                                <TableCell>R1</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV7</TableCell>
                                <TableCell>R2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV8</TableCell>
                                <TableCell>R2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LV9</TableCell>
                                <TableCell>R2</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Container>

        </>
    );
}
