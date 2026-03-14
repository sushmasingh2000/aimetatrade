import Header2 from "./Layouts/Header2";
import download from "../assets/images/donload-img.png";
import logo from "../assets/images/logo/logo.png";
import { Link } from "react-router-dom";
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import { usePWA } from "../hooks/usePWA";
import { useEffect, useState } from "react";

export default function Download() {
    const { deferredPrompt, installApp, isIOS } = usePWA();
    console.log(deferredPrompt)

    const [showInstallUI, setShowInstallUI] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInstallUI(true);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, []);


    const handleIosDownload = () => {
        // Point to where you stored the .mobileconfig file
        const profileUrl = '/app-install.mobileconfig';
        window.location.href = profileUrl;
    };

    return (
        <>
            <style>
                {`
                    .download_img img {
    width: 100%;
    max-width: 130px;
    margin: auto;
    display: block;
    margin-top: 40px;
}
 
.logo_download img {
    width: 100%;
    max-width: 170px;
    margin: auto;
    display: block;
    margin-top: 50px;
}
 
.download_ios  {
    width: 100%;
    padding: 10px 10px !important;
    background: #ad49ff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: 40px;
    color: #fff;
    font-size: 15px;
    gap: 9px;
    margin-top: 50px;
}
 
.download_and  {
    width: 100%;
    padding: 10px 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: 40px;
    color: #ad49ff;
    font-size: 15px;
    gap: 9px;
    border: 1px solid #ad49ff;
    margin-top: 20px;
}
 
 #root {
                        height: 100vh;
                    }
               
                `}
            </style>
            <Header2  title="App Download"/>
            <Container sx={{ px: '30px !important' }}>
                <Box className="download_img">
                    <img src={download} alt="download" />
                </Box>
                <Box className="logo_download">
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                </Box>
                {true && (
                    <Box className="download_ios" onClick={handleIosDownload}>
                        <i class="ri-apple-fill"></i> IOS Download
                    </Box>
                )}
                {deferredPrompt ?
                    <Box sx={{cursor: "pointer"}} className="download_and" onClick={installApp}>
                        <i class="ri-android-fill"></i> Android Download
                    </Box> :
                    <Box className="download_and" onClick={installApp}>
                        <i class="ri-android-fill"></i> Android Download
                    </Box> 
                }
            </Container>
        </>
    )
}