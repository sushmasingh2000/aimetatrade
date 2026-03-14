import Header2 from "./Layouts/Header2";
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import logo from "../assets/images/logo/logo.png";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Help() {
    return (
        <>
            <style>
                {`
                    #root {
                        height: 100vh;
                    }
                `}
            </style>
            <Header2  title="Help"/>

            <Container sx={{ px: '10px !important' }}>
                <Box className="NewsBox">
                    <Box component="img" src={logo} alt="logo" sx={{ mb: 2 }}></Box>
                    <TextField
                        fullWidth
                        placeholder="Search…"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                height: "44px",
                                borderColor: "#fff",
                                "&:hover fieldset": {
                                    borderColor: "#ad49ff", // hover color
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#ad49ff", // focus color
                                },
                            },

                        }}
                    />
                </Box>
                 <Box className="help_box" sx={{mt: 3}}>
                    <List>
                         <ListItem>
                            <Typography variant="h5">Support Center</Typography>
                         </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>About Official account and demo account</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>What is transaction volume?</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>Why do we need to transfer funds?</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>What are futures?</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>Why does the amount of assets after conversion change?</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>Why do we need real-name authentication?</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>What is frozen assets?</Typography>
                        </ListItem>
                        <ListItem>
                            <span><i class="ri-bard-line"></i></span>
                            <Typography>What are the rules of futures trading?</Typography>
                        </ListItem>
                    </List>
                </Box>
            </Container>
        </>
    )
}