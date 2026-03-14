import React from "react";
import { Box, Typography } from "@mui/material";
import {
    FaTelegramPlane,
    FaInstagram,
    FaFacebook,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Header2 from "./Layouts/Header2";

const links = [
    { name: "Telegram", icon: <FaTelegramPlane />, url: "https://t.me/ifctradeofficial" },
    { name: "X", icon: <FaXTwitter />, url: "#" },
    { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/ifctradeofficial" },
    { name: "Facebook", icon: <FaFacebook />, url: "#" },
    { name: "Youtube", icon: <FaYoutube />, url: "https://youtube.com/@ifctradeofficial" },
];

export default function OfficialLinks() {
    return (
        <>
            <Header2 title="Official Community Channel" />
            <Box
                sx={{
                    background: "#000",
                    minHeight: "100vh",
                    p: 3,
                    color: "#fff",
                    fontFamily: "sans-serif",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {links.map((item, index) => (
                        <Box
                            key={index}
                            onClick={() => window.open(item.url, "_blank")} 

                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#111",
                                p: 2.5,
                                borderRadius: 2,
                                cursor: "pointer",
                                border: "1px solid #222",
                                minHeight: 60,
                                transition: "0.3s",
                                "&:hover": {
                                    background: "#222",
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ fontSize: 26 }}>{item.icon}</Box>
                                <Typography sx={{ fontSize: 18 }}>{item.name}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: 22, color: "#888" }}>→</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}
