import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import coming from "../assets/images/commingsoon.png"

export default function SoonComming() {
    const navigate = useNavigate();

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            <Box>
                {/* Icon */}
                <Box
                    sx={{
                        fontSize: 70,
                        mb: 2,
                        background: "linear-gradient(45deg,#9f41ec,#ff6ec4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    <Box
                        component="img"
                        src={coming}
                        alt=""
                        sx={{ width: "300px" }}
                    />

                </Box>


                {/* Subtitle */}
                <Typography
                    sx={{
                        color: "#9aa4d4",
                        mb: 4,
                        fontSize: 14,
                    }}
                >
                    We are working hard to bring this feature live.
                    Stay tuned for something amazing!
                </Typography>

                {/* Button */}
                <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 3,
                        fontWeight: 600,
                        background: "linear-gradient(90deg,#9f41ec,#ff6ec4)",
                        textTransform: "none",
                        "&:hover": {
                            background: "linear-gradient(90deg,#7d18d2,#ff4db8)",
                        },
                    }}
                >
                    Go Back
                </Button>
            </Box>
        </Container>
    );
}
