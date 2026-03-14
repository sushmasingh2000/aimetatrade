 import Header2 from "./Layouts/Header2";
 import { Box, Container, Typography } from '@mui/material';
 import logo from "../assets/images/logo/logo.png";
 
 export default function News(){
    return(
        <>
         <style>
                {`
                    #root {
                        height: 100vh;
                    }
                `}
            </style>
         <Header2 />

         <Container sx={{ px: '10px !important' }}>
            <Box className="NewsBox" >
                <Box component="img" src={logo} alt="logo"></Box>
                <Typography variant="h5">Good News : <span> AI Meta Trade Successfully applied for Sec license from the U.S Securities and Exchange Commission</span></Typography>
            </Box>
           
         </Container>
        </>
    )
 }