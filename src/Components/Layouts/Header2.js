import { ControlPointDuplicate, CopyAll, History, HistoryEdu, HistoryEduTwoTone } from "@mui/icons-material";
import { ListItem, ListItemButton, Typography, Box, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaFileCirclePlus } from "react-icons/fa6";


export default function Header2({ title, historyRoute }) {
    const navigate = useNavigate();

    return (
        <Box component="header">
            <List sx={{ display: "flex", justifyContent: "space-between" }}>
                
                {/* Back Button */}
                <ListItem sx={{ width: "auto" }}>
                    <Typography onClick={() => navigate(-1)}>
                        <i className="ri-arrow-left-s-line"></i>
                    </Typography>
                </ListItem>

                {/* Dynamic Title */}
                <ListItem sx={{ width: "auto"}}>
                    <Typography sx={{fontSize: "18px !important" , fontWeight: 600}} variant="h6">{title}</Typography>
                </ListItem>

                {/* Dynamic History Route */}
                <ListItem sx={{ width: "auto" }}>
                    {historyRoute && (
                        <ListItemButton  onClick={() => navigate(historyRoute)}>
                       <FaFileCirclePlus />

                        </ListItemButton>
                    )}
                </ListItem>

            </List>
        </Box>
    );
}
