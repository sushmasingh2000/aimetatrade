import Header2 from "./Layouts/Header2";
import {
  Box,
  Container,
  ListItem,
  Typography,
  List,
  ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import withdrawal from "../assets/images/icons/withdrawal.png";
import deposit from "../assets/images/icons/deposit.png";
import transfer from "../assets/images/icons/transfer.png";
import convert from "../assets/images/icons/convert.png";
import perpetual from "../assets/images/icons/perpetual.png";
import futures from "../assets/images/icons/futures.png";
import help from "../assets/images/icons/help.png";
import contactus from "../assets/images/icons/contactus.png";
import about from "../assets/images/icons/about.png";
import Earn from "../assets/images/icons/earn.png";
import Task from "../assets/images/icons/task.png";
export default function More() {
  return (
    <>
      <style>
        {`
                    #root {
                        height: 100vh;
                    }
                `}
      </style>
      <Header2 />

      <Container sx={{ px: "10px !important" }}>
        <Box className="main_btne">
          <Typography variant="h6">Conventional</Typography>
          <List sx={{ marginTop: "15px !important" }}>
            <ListItem>
              <ListItemButton component={Link} to="/Deposit">
                <Box component="img" src={deposit} alt="deposit"></Box>
                <Typography>Deposit</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/Withdrawal">
                <Box component="img" src={withdrawal} alt="withdrawal"></Box>
                <Typography>Withdrawal</Typography>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton component={Link} to="/Transfer">
                <Box component="img" src={transfer} alt="transfer"></Box>
                <Typography>Transfer</Typography>
              </ListItemButton>
            </ListItem>
            {/* <ListItem>
                            <ListItemButton component={Link} to="/More">
                                <Box component='img' src={convert} alt="convert"></Box>
                                <Typography>Convert</Typography>
                            </ListItemButton>
                        </ListItem> */}
            <ListItem>
              <ListItemButton component={Link} to="/More">
                <Box component="img" src={Earn} alt="Earn"></Box>
                <Typography>Earn</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/More">
                <Box component="img" src={Task} alt="Task"></Box>
                <Typography>Task</Typography>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box className="main_btne ">
          <Typography variant="h6">Trade Market</Typography>
          <List sx={{ marginTop: "15px !important" }}>
            <ListItem>
              <ListItemButton to="/markets" component={Link}>
                <Box component="img" src={perpetual} alt="perpetual"></Box>
                <Typography>Crypto</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/soon">
                <Box component="img" src={futures} alt="futures"></Box>
                <Typography>Forex</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/soon">
                <Box></Box>
                <Typography></Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/soon">
                <Box></Box>
                <Typography></Typography>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box className="main_btne ">
          <Typography variant="h6">Other</Typography>
          <List sx={{ marginTop: "15px !important" }}>
            <ListItem>
              <ListItemButton component={Link} to="/Help">
                <Box component="img" src={help} alt="help"></Box>
                <Typography>Help</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                component={Link}
                sx={{ cursor: "pointer" }}
                // onClick={() =>
                //   window.open("https://t.me/ifcinvestment", "_blank")
                // }
              >
                <Box component="img" src={contactus} alt="contactus"></Box>
                <Typography>Contact Us</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="/About">
                <Box component="img" src={about} alt="about"></Box>
                <Typography>About Us</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component={Link} to="">
                <Box component="img" src={convert}></Box>
                <Typography>FAQ</Typography>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Container>
    </>
  );
}
