import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import copy from "clipboard-copy";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint, front_end_domain } from "../services/urls";
import Header2 from "./Layouts/Header2";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getFloatingValue } from "../utils/utilityFun";
import { FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Promotional() {

  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [higherMembers, setHigherMembers] = useState([]);

  const { data } = useQuery(
    ["dashboard"],
    () => apiConnectorGet(endpoint?.member_details),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
  const user = data?.data?.result[0] || [];

  const { data: level } = useQuery(
    ["level"],
    () => apiConnectorPost(endpoint?.get_level_wise),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
  const level_wise = level?.data?.result || [];

  const { data: rank_wise_member } = useQuery(
    ["rank_wise_mem"],
    () => apiConnectorPost(endpoint?.rank_wise_data),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
  const rank_wise_member_ = rank_wise_member?.data?.result || [];

  const functionTOCopy = (value) => {
    copy(value);
    toast("Copied to clipboard!", { id: 1 });
  };
  const navigate = useNavigate();

  const higherRankFn = async (id) => {
    try {
      const res = await apiConnectorPost(endpoint?.get_higher_rank_member, {
        tr03_reg_id: id,
      });

      setHigherMembers(res?.data?.result || []);
      setSelectedMember(id);
      setOpen(true);

    } catch (e) {
      console.log("something went wrong");
    }
  };

   const { data: dash_business } = useQuery(
          ["get_total_member"],
          () => apiConnectorGet(endpoint?.get_total_member),
          {
              refetchOnMount: false,
              refetchOnWindowFocus: true,
              refetchOnReconnect: true,
          }
      );
      const level_member = dash_business?.data?.result || []

  return (
    <>


      <Header2 title="Promotion" />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#1d1b1b" }}>
        <Container >
          <Box className="share_code">
            <Box className="scanner_img">
              <QRCode
                className="qrr"
                value={`${front_end_domain}/register?ref=${user?.tr03_cust_id}`}
                size={200}
                level="H"
              />
            </Box>
            <List sx={{ mt: 4 }}>
              <ListItem>
                <Typography>My Invitation code:</Typography>
                <Typography>
                  <span>{user?.tr03_cust_id}</span>
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
              <Button
                variant="text"
                className="main_btn"
                onClick={() => {
                  if (user?.tr03_cust_id) {
                    functionTOCopy(
                      `Registration Link:\n${front_end_domain}/register/?ref=${user.tr03_cust_id}`
                    );
                  } else {
                    console.log("User ID not found");
                  }
                }}
              >
                Copy Invitation Link Here
              </Button>


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
              <Typography>
                Direct Member's: {user?.tr03_dir_mem || 0}
                {/* <span
                  style={{
                    cursor: user?.tr03_dir_mem > 0 ? "pointer" : "default",
                    color: user?.tr03_dir_mem > 0 ? "#bf4afb" : "white",
                  }}
                  onClick={() => {
                    if (user?.tr03_dir_mem > 0) {
                      navigate(`/all_level`);
                    }
                  }}
                >
                  {user?.tr03_dir_mem || 0}
                </span> */}
              </Typography>

              <Typography>
                {" "}
                Direct Bussiness:  <span style={{ color: "#38bd1e" }}>${getFloatingValue(level_member?.dir_buss)}</span>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                justifyItems: "start",
              }}
            >
              <Typography> Team Member's:   <span
                style={{
                  cursor: user?.tr03_team_mem > 0 ? "pointer" : "default",
                  color: user?.tr03_team_mem > 0 ? "#bf4afb" : "white",
                }}
                onClick={() => {
                  if (user?.tr03_team_mem > 0) {
                    navigate(`/all_level`);
                  }
                }}
              >
                {user?.tr03_team_mem || 0}
              </span></Typography>
              <Typography>
                Team Bussiness:  <span style={{ color: "#38bd1e" }}>${getFloatingValue(level_member?.team_buss)}</span>
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* <Typography sx={{ textAlign: "center" }}>Level & Business</Typography> */}
        <Container sx={{ padding: 0, backgroundColor: "#1d1b1b" }}>
          <Accordion
            defaultExpanded
            sx={{
              backgroundColor: "#1d1b1b",
              color: "white",
              boxShadow: "none",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ backgroundColor: "#1d1b1b", mb: "-5px" }}
            >
              <Typography fontWeight={600} sx={{ color: "white" }}>
                Level & Business
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Paper
                className="ruble"
                sx={{ backgroundColor: "#111", color: "white" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Level</TableCell>
                      <TableCell sx={{ color: "white" }}>Member</TableCell>
                      <TableCell sx={{ color: "white" }}>Active Mem.</TableCell>
                      <TableCell sx={{ color: "white" }}>Business</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {level_wise?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "white" }}>
                          Level {item?.level_id}
                        </TableCell>
                        <TableCell
                          sx={{
                            cursor: item?.total_mem > 0 ? "pointer" : "default",
                            color: item?.total_mem > 0 ? "#bf4afb !important" : "white !important",
                          }}
                          onClick={() => {
                            if (item?.total_mem > 0) {
                              navigate(`/level/${item?.level_id}`);
                            }
                          }}
                        >
                          {item?.total_mem}
                        </TableCell>

                        <TableCell >
                          {item?.active_mem || 0}
                        </TableCell>
                        <TableCell sx={{ color: "#38bd1e !important" }}>
                          ${getFloatingValue(item?.total_business)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Container>
        {/* rank table */}
        <Container
          sx={{ padding: 0, backgroundColor: "#1d1b1b", marginBottom: "90px" }}
        >
          <Accordion
            defaultExpanded
            sx={{
              backgroundColor: "#1d1b1b",
              color: "white",
              boxShadow: "none",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ backgroundColor: "#1d1b1b" }}
            >
              <Typography fontWeight={600} sx={{ color: "white" }}>
                Team Wings With Rank
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Paper
                className="ruble"
                sx={{ backgroundColor: "#1d1b1b", color: "white" }}
              >
                <TableContainer
                  sx={{
                    maxHeight: 400,
                    overflow: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "white" }}>Wing</TableCell>
                        <TableCell sx={{ color: "white" }}>UID</TableCell>
                        <TableCell
                          sx={{
                            color: "white",     // lines ke beech gap kam kare
                          }}
                        >
                          Team
                          <br/>
                         Business
                        </TableCell>
                        <TableCell >Higher Rank  <br/> UID / Name</TableCell>
                        <TableCell sx={{ color: "white" }}> Rank Name </TableCell>
                        <TableCell sx={{ color: "white" }}> Level</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rank_wise_member_?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: "white" }}>
                            {item?.wings_name?.split(" ")[1]}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item?.dir_cust_id}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {getFloatingValue(item?.wing_buss)}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item?.uniq_id === "0" ? "--" : item?.uniq_id} / {item?.wing_mem_name==="N/A"
                            ? "--" : item?.wing_mem_name}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item?.higher_rnk_name==="N/A" ?  "--" : item?.higher_rnk_name}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item?.level_id}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Container>

        {/* <Container sx={{ padding: "15px !important", marginBottom: "90px" }}>
          <Paper className="ruble" sx={{ mb: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th">Team Level</TableCell>
                  <TableCell component="th">Require</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              
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
        </Container> */}
        <Container sx={{ paddingBottom: "15px !important" }}></Container>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: "#1d1b1b",
              color: "white",
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Higher Rank Members
          </DialogTitle>

          <DialogContent dividers>
            {higherMembers.length === 0 ? (
              <Typography>No Members Found</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>UID</TableCell>
                    <TableCell sx={{ color: "white" }}>Level</TableCell>
                    <TableCell sx={{ color: "white" }}>Rank </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {higherMembers.map((mem, i) => {

                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ color: "white" }}>
                          {mem?.tr03_cust_id || "--"}
                        </TableCell>
                        <TableCell sx={{ color: "white" }} >
                          {mem?.level_id || "--"}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {mem?.m07_rank_name || "--"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              sx={{ color: "#bf4afb" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
