import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  IconButton,
} from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import HistoryIcon from "@mui/icons-material/History"; // MUI icon for history
import { getFloatingValue } from "../utils/utilityFun";

export default function Transfer() {
  const [walletType, setWalletType] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("USDT"); // Asset fixed to USDT
  const client = useQueryClient();

  const fk = useFormik({
    initialValues: { inr_value: "" },
    onSubmit: () => {},
  });

  const { data } = useQuery(
    ["dashboard"],
    () => apiConnectorGet(endpoint?.member_details),
    { refetchOnMount: false, refetchOnWindowFocus: true, refetchOnReconnect: true }
  );

  const user = data?.data?.result?.[0] || {};

  async function SpotWallet() {
    const reqbody = { pkg_amount: Number(fk.values.inr_value) };
    try {
      const res = await apiConnectorPost(endpoint?.activation_user, reqbody);
      toast(res?.data?.message);
      if (res?.data?.success) {
        client.refetchQueries("dashboard");
        fk.resetForm();
      }
    } catch (e) {
      console.error(e);
      toast.error("Spot transfer failed");
    }
    setLoading(false);
  }

  async function ProfitWallet() {
    const reqbody = { amount: Number(fk.values.inr_value) };
    try {
      const res = await apiConnectorPost(endpoint?.member_compound_request, reqbody);
      toast(res?.data?.message);
      if (res?.data?.success) {
        client.refetchQueries("dashboard");
        fk.resetForm();
      }
    } catch (e) {
      console.error(e);
      toast.error("Profit transfer failed");
    }
    setLoading(false);
  }

  const handleSubmit = () => {
    if (!walletType) {
      toast.error("Please select wallet");
      return;
    }
    if (!fk.values.inr_value || Number(fk.values.inr_value) <= 0) {
      toast.error("Please enter valid amount");
      return;
    }
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Do you want to proceed with the transfer?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, transfer it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        if (walletType === "spot") SpotWallet();
        else if (walletType === "profit") ProfitWallet();
      }
    });
  };

  const handleHistoryClick = () => {
    // Implement navigation or modal for transfer history
    toast("Open transfer history");
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#040d12", color: "cyan", px: 3, pb: 14, pt: 4, fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
        {/* Header with History icon top right */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" color="cyan">
            Transfer
          </Typography>
          <IconButton onClick={handleHistoryClick} sx={{ color: "cyan" }} title="Transfer History">
            <HistoryIcon />
          </IconButton>
        </Box>

        <CustomCircularProgress isLoading={loading} />

        {/* From Wallet Select */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: "#808080" }}>From</InputLabel>
          <Select
            value={walletType}
            label="From"
            onChange={(e) => setWalletType(e.target.value)}
            sx={{
              color: "cyan",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#8080806b" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00b578" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00b578" },
            }}
          >
            <MenuItem value="spot">Spot</MenuItem>
            <MenuItem value="profit">Profit</MenuItem>
          </Select>
        </FormControl>

        {/* Transfer To Select (fixed to Trade) */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: "#808080" }}>To</InputLabel>
          <Select
            value="trade"
            label="To"
            disabled
            sx={{
              color: "cyan",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#8080806b" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00b578" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00b578" },
            }}
          >
            <MenuItem value="trade">Trade</MenuItem>
          </Select>
        </FormControl>

        {/* Asset Select (fixed to USDT) */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: "#808080" }}>Asset</InputLabel>
          <Select
            value="USDT"
            label="Asset"
            disabled
            sx={{
              color: "cyan",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#8080806b" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00b578" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00b578" },
            }}
          >
            <MenuItem value="USDT">USDT</MenuItem>
          </Select>
        </FormControl>

        {/* Balance display */}
        <Typography variant="body2" sx={{ mb: 1, textAlign: "right", color: "#38bd1e", fontWeight: 600 }}>
          {walletType === "profit"
            ? `Profit Available: $${getFloatingValue(user?.tr03_inc_wallet) ?? "--"}`
            : walletType === "spot"
            ? `Spot Available: $${getFloatingValue(user?.tr03_fund_wallet) ?? "--"}`
            : `Available Balance: $0.00`}
        </Typography>

        {/* Amount Input */}
        <TextField
          label="Amount"
          type="number"
          inputProps={{ min: 0.0001, step: 0.0001 }}
          value={fk.values.inr_value}
          onChange={(e) => {
            let val = e.target.value;
            val = val.replace(/[^0-9.]/g, ""); // only numbers and dot
            // Ensure max one dot and min decimal places handling
            const parts = val.split(".");
            if (parts.length > 2) val = parts[0] + "." + parts[1];
            fk.setFieldValue("inr_value", val);
          }}
          onKeyDown={(e) => {
            // Block minus, e, + keys
            if (["-", "e", "+"].includes(e.key)) e.preventDefault();
          }}
          fullWidth
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              color: "cyan",
              "&:hover fieldset": { borderColor: "#00b578" },
              "&.Mui-focused fieldset": { borderColor: "#00b578" },
            },
          }}
          placeholder="0"
        />

        {/* Transfer Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            bgcolor: "#00b578",
            fontWeight: "bold",
            fontSize: 16,
            "&:hover": { bgcolor: "#00875a" },
          }}
        >
          Transfer
        </Button>

        {/* Important Notices */}
        {walletType === "spot" && (
          <Box sx={{ mt: 4, px: 2, color: "cyan" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Important Notice
            </Typography>
            <Typography sx={{ fontSize: 13, mb: 1 }}>
              1. First transfer from <b>Spot to Trade</b> must be a minimum of{" "}
              <span style={{ color: "#22c55e" }}>$50</span>.
            </Typography>
            <Typography sx={{ fontSize: 13, mb: 1 }}>
              2. After the first transfer, you can transfer as low as{" "}
              <span style={{ color: "#22c55e" }}>$1</span>.
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 2, mb: 1 }}>
              3. First Deposit Bonus Structure:
            </Typography>
            <Box sx={{ border: "1px solid #333", borderRadius: 1, overflow: "hidden" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  bgcolor: "#1a1a1a",
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid #333",
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Deposit Amount</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Bonus</Typography>
              </Box>
              {[
                { range: "$50 – $299", bonus: "+ $3" },
                { range: "$300 – $999", bonus: "+ $10" },
                { range: "$1000 – $4999", bonus: "+ $25" },
                { range: "$5000 & above", bonus: "+ $100" },
              ].map((row, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    borderBottom: idx !== 3 ? "1px solid #333" : "none",
                    color: "#38bd1e",
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>{row.range}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{row.bonus}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {walletType === "profit" && (
          <Box sx={{ mt: 4, px: 2, color: "cyan" }}>
            <Typography variant="h6" gutterBottom>
              Important Notice
            </Typography>
            <Typography sx={{ fontSize: 13 }}>
              1. You can transfer a minimum of $1 to the Trade Wallet and get compounding benefits.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}