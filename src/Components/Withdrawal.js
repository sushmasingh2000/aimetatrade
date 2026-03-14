import React, { useState } from "react";
import Header2 from "./Layouts/Header2";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Stack,
} from "@mui/material";
import coin1 from "../assets/images/chart-icon/1.png";
import { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { useFormik } from "formik";
import { endpoint } from "../services/urls";
import toast from "react-hot-toast";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import { History } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getFloatingValue } from "../utils/utilityFun";

export default function Dashboard() {
  const [loding, setloding] = useState(false);
  const navigate = useNavigate();
  const { data: wallet, refetch } = useQuery(
    ["dashboard"],
    () => apiConnectorGet(endpoint?.member_details),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
  const user = wallet?.data?.result[0] || [];

  const fk = useFormik({
    initialValues: {
      user_amount: "",
      wallet_address: user?.lgn_wallet_add || "",
      wallet_type: "income_wallet",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!user?.lgn_wallet_add) return toast("Update Wallet address first");
      setloding(true);
      try {
        const res = await apiConnectorPost(endpoint.member_payout, values);
        setloding(false);
        toast(res?.data?.message, { id: 1 });
        refetch();
        fk.resetForm();
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    },
  });

  return (
    <>
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#1d1b1b", pb: 4 }}
      >
        <Header2 title="Withdrawal" historyRoute="/withdrawal-history" />
        <CustomCircularProgress isLoading={loding} />
        <Grid
          container
          spacing={2}
          sx={{ px: 2, mt: 3, display: "flex", alignItems: "center" }}
        >
          <Grid size={{ lg: 7, xs: 7 }}>
            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
              className="Usdt_box"
            >
              <Box component="img" src={coin1} alt="coin1"></Box>
              <Typography variant="h6">USDT BEP20</Typography>
            </Box>
          </Grid>
          <Grid size={{ lg: 5, xs: 5 }}>
            <Box className="select_currency">
              <Typography sx={{ fontSize: "15px", ml: 4, color: "#686868" }}>
                {fk.values.wallet_type === "income_wallet" && (
                  <span>
                    Profit:  <span style={{ color: "#38bd1e" }}>${getFloatingValue(user?.tr03_inc_wallet)}</span>
                  </span>
                )}
                {fk.values.wallet_type === "spot_wallet" && (
                  <span>Spot:  <span style={{ color: "#38bd1e" }}>${getFloatingValue(user?.tr03_fund_wallet)}</span>
                  </span>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <FormControl sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <RadioGroup
            row
            name="wallet_type"
            value={fk.values.wallet_type}
            onChange={fk.handleChange}
          >
            <FormControlLabel
              value="income_wallet"
              label="Profit"
              control={
                <Radio
                  sx={{
                    color: "#ffffff", // unselected
                    "&.Mui-checked": {
                      color: "#fff", // selected
                    },
                  }}
                />
              }
              sx={{
                color:
                  fk.values.wallet_type === "income_wallet" ? "#fff" : "#ffffff",
              }}
            />

            <FormControlLabel
              value="spot_wallet"
              label="Spot "
              control={
                <Radio
                  sx={{
                    color: "#ffffff",
                    "&.Mui-checked": {
                      color: "#fff",
                    },
                  }}
                />
              }
              sx={{
                color:
                  fk.values.wallet_type === "spot_wallet" ? "#fff" : "#ffffff",
              }}
            />
          </RadioGroup>
        </FormControl>
        <Box className="main_form" sx={{ px: 2, mt: 3 }}>
          <InputLabel>Withdrawal Address</InputLabel>
          {/* <TextField
          fullWidth
          placeholder="Please bind withdrawal wallet address"
          id="wallet_address"
          name="wallet_address"
          //   onChange={fk.handleChange}
          value={fk.values?.wallet_address}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#ad49ff", // hover color
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ad49ff", // focus color
              },
            },
          }}
        /> */}
          <p
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ad49ff",
              borderRadius: "4px",
              color: "#fff",
              background: "#111",
              margin: 0,
              fontSize: "12px",
            }}
            onClick={() =>
              !fk.values?.wallet_address && navigate("/update-wallet-address")
            }
          >
            {fk.values?.wallet_address || "Please bind withdrawal wallet address"}
          </p>
        </Box>

        <Box className="main_form" sx={{ px: 2, mt: 3 }}>
          <InputLabel>Withdrawal Amount</InputLabel>
          <TextField
            type="number"
            id="user_amount"
            name="user_amount"
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                fk.setFieldValue("user_amount", value);
              }
            }}

            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*"
            }}

            value={fk.values?.user_amount}
            fullWidth
            placeholder="Please amount"
            sx={{
              "& .MuiOutlinedInput-root": {
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

        {/* <Box className="main_form" sx={{ px: 2, mt: 3 }}>
                <InputLabel>Handling Fee</InputLabel>
                <TextField fullWidth placeholder="0" sx={{
                    "& .MuiOutlinedInput-root": {

                        "&:hover fieldset": {
                            borderColor: "#ad49ff", // hover color
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#ad49ff", // focus color
                        },
                    },
                }} />

            </Box> */}

        <Box className="note_main" sx={{ px: 2, mt: 2, pb: 3 }}>
          <Button
            className="note_main"
            sx={{ mb: "20px" }}
            onClick={fk.handleSubmit}
            disabled={!fk.values.wallet_address || !fk.values.user_amount}
          >
            Withdrawal
          </Button>

          <Typography variant="h6">Important Notice</Typography>
          <Typography>
            1. After submitting the withdrawal application, the funds are in a
            frozen state because the withdrawal is in progress and the funds are
            temporarily under the custody of the system, which does not mean that
            you have lost the asset or the asset is abnormal.
          </Typography>
          <Typography>
            2. The account will be received within 24 hours after submitting the
            withdrawal application. If the account is not received after the
            estimated time of withdrawal, please consult the online customer
            service.
          </Typography>
          <Typography>
            3. In order to prevent arbitrage behavior, the transaction volume can
            be applied for withdrawal after reaching the limit.
          </Typography>
          <Typography>4. The withdrawal fee is 5% Only .</Typography>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Encounter problems? feedback immediately
          </Typography>
        </Box>
      </Box>
    </>
  );
}
