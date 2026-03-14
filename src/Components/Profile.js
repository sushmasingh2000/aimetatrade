import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { domain, endpoint, front_end_domain } from "../services/urls";
import Header2 from "./Layouts/Header2";
import toast from "react-hot-toast";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";

export default function ProfilePage() {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loader, setloader] = useState(false);

    const { data, refetch } = useQuery(
        ["dashboard"],
        () => apiConnectorGet(endpoint?.member_details),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );

    const user = data?.data?.result?.[0] || {};

    // Copy UID
    const copyToClipboard = () => {
        if (user?.lgn_cust_id) {
            navigator.clipboard.writeText(user.lgn_cust_id);
            alert("UID copied!");
        }
    };

    // Handle Image Select
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Upload Image
    const handleImageUpload = async () => {
        if (!selectedImage) return;
        setloader(true)
        try {
            const formData = new FormData();
            formData.append("file", selectedImage);

            await apiConnectorPost(endpoint?.update_profile_image, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setloader(false);
            toast("Profile image updated successfully!");
            setOpen(false);
            setSelectedImage(null);
            setPreview("");
            refetch(); // refresh user data
        } catch (error) {
            console.log("Upload failed");
            setloader(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    };

    return (
        <>
            <Header2 title="User Information" />
            <CustomCircularProgress isLoading={loader} />
            <Box
                sx={{
                    minHeight: "100vh",
                    color: "#fff",
                    px: "10px",
                }}
            >
                {/* Avatar Section */}
                <Box
                    sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        mx: "auto",
                        mb: 3,
                    }}
                >
                    <Avatar
                        src={domain + user?.lng_profile}
                        sx={{
                            width: 100,
                            height: 100,
                        }}
                    >
                        {domain + user?.lng_profile}
                    </Avatar>

                    <IconButton
                        onClick={() => setOpen(true)}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            bgcolor: "#2d2c2e",
                            color: "#fff",
                            "&:hover": { bgcolor: "#1e1d1f" },
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Info Box */}
                <Box
                    sx={{
                        // bgcolor: "#131212",
                        borderRadius: 2,
                        p: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1,
                            pt: 1,
                            borderBottom: "1px solid #444",
                        }}
                    >
                        <Typography>UID</Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ color: "#bbb" }}>
                                {user.lgn_cust_id || "--"}
                            </Typography>

                            <Tooltip title="Copy UID">
                                <IconButton
                                    size="small"
                                    sx={{ color: "#9f41ec" }}
                                    onClick={copyToClipboard}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <InfoRow label="Name" value={user.lgn_name || "--"} />
                    <InfoRow label="Country" value={user?.lgn_cntry_name || "--"} />
                    <InfoRow label="Mobile No." value={user?.lgn_mobile} />
                    <InfoRow label="Email" value={user.lgn_email || "--"} />
                    <InfoRow label="Rank" value={user.rank_name || "--"} />
                    <InfoRow label="Sponsor UID" value={user.spon_id || "--"} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",   // vertical alignment
                            mb: 1,
                            pb: 1,
                            pt: 1,
                        }}
                    >
                        <Typography > Status </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ color: user.tr03_topup_date ===
                                 "Active" ? "#38bd1e" : "#e2604e !important" }}>
                                    {user.tr03_topup_date ? "Active" : "InActive"}</Typography>
                        </Box>
                    </Box>


                    {/* UID */}


                    {/* Logout */}
                    <Button
                        onClick={handleLogout}
                        sx={{
                            background: "black",
                            color: "#ff4a3a",
                            textTransform: "none",
                            fontWeight: "bold",
                            width: "100%",
                            mt: 4,
                        }}
                    >
                        Log out
                    </Button>
                </Box>
            </Box>

            {/* Image Update Modal */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        bgcolor: "#1e1e1e",
                        color: "#fff",
                        borderRadius: 3,
                        textAlign: "center",
                    },
                }}
            >
                <DialogTitle>Update Profile Image</DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            bgcolor: "#9f41ec",
                            "&:hover": { bgcolor: "#7c2bd6" },
                        }}
                    >
                        Choose Image
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>

                    {preview && (
                        <Box mt={3}>
                            <Avatar
                                src={preview}
                                sx={{ width: 80, height: 80, mx: "auto" }}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: "#aaa" }}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        disabled={!selectedImage}
                        onClick={handleImageUpload}
                        sx={{
                            bgcolor: "#9f41ec",
                            "&:hover": { bgcolor: "#7c2bd6" },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function InfoRow({ label, value, isLast }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",   // vertical alignment
                mb: 1,
                pb: 1,
                pt: 1,
                borderBottom: isLast ? "none" : "1px solid #444",
            }}
        >
            <Typography >{label}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ color: "#bbb" }}>{value}</Typography>
            </Box>
        </Box>
    );
}
