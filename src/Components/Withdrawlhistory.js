import {
  Box,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import CustomToPagination from "../shared/CustomPagination";
import CustomCircularProgress from "../shared/loder/CustomCircularProgress";
import { getFloatingValue } from "../utils/utilityFun";
import Header2 from "./Layouts/Header2";

function WithdrawHistory() {
  const [isAllValue, setIsAllValue] = useState(false);
  const [data, setData] = useState([]);
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };


  const walletMap = {
    0: "profit_withdrawal",
    1: "spot_withdrawal"
  };

  const WithdrawHistoryFn = async () => {
    setLoading(true);
    try {
      const wallet_type = walletMap[tabValue];
      const res = await apiConnectorPost(endpoint?.member_payout_report, {
        start_date: from_date,
        end_date: to_date,
        search,
        page,
        count: 10,
        wallet_type
      });
      if (res?.data?.result) {
        setData(res.data.result);
      } else {
        setData([]);
      }
    } catch (e) {
      console.log(e);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    WithdrawHistoryFn();
  }, [page, tabValue]); // ✅ call API on tab change too

  const { data: dashboard_data } = useQuery(
    ["dashboard_data"],
    () => apiConnectorGet(endpoint?.member_dashboard
    ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );
  const member_dashboard = dashboard_data?.data?.result || []

  return (
    <>
      <Header2 title="Withdrawal History" />
      <CustomCircularProgress isLoading={loading} />

      <Container sx={{ minHeight: "100vh", pb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          // px="20px"
          mt="10px"
        >
          <Typography
            sx={{

            }}
          >
            Total Withdrawal :
          </Typography>
          <Typography sx={{ color: '#38bd1e !important', fontWeight: 600, mr: 2, }}>
            $ {getFloatingValue(member_dashboard?.total_withdrawal)}
          </Typography>
        </Stack>
        {/* Tabs */}
        {/* <Tabs
          value={tabValue}
          onChange={handleChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ borderRadius: "12px", p: "4px", minHeight: "auto", mt: 2 }}
        >
          <Tab
            label="Profit"
            sx={{
              flex: 1,
              textTransform: "none",
              minHeight: "40px",
              minWidth: 0,
              color: "#cfd8ff !important",
              transition: "0.3s",
              "&.Mui-selected": {
                background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                color: "#fff !important",
              },
            }}
          />
          <Tab
            label="Spot"
            sx={{
              flex: 1,
              textTransform: "none",
              minHeight: "40px",
              minWidth: 0,
              color: "#cfd8ff !important",
              transition: "0.3s",
              "&.Mui-selected": {
                background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                color: "#fff !important",
              },
            }}
          />

        </Tabs> */}

        {/* Withdrawal List */}
        <Box sx={{ mt: 3 }}>
          {data?.data?.length === 0 && !loading ? (
            <Box
              sx={{
                mt: 6,
                mx: "auto",
                width: "92%",
                p: 4,
                borderRadius: 2,
                background: "#05080f",
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                No Withdrawal History Found
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#aaa", mt: 1 }}>
                You haven’t made any Withdrawals yet.
              </Typography>
            </Box>
          ) : (
            data?.data?.map((i, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 1,
                  borderRadius: 2,
                  background: "#05080f",
                  width: "92%",
                  margin: "auto",
                  mt: 1,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 1, borderBottom: "1px solid #efefef" }}
                >
                  <Typography
                    sx={{
                      background: "#17B15E",
                      borderRadius: 1,
                      px: 1 ,
                       color: "#fff",
                      fontSize: "12px !important",
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    sx={{
                      color: i?.tr11_status === "Success"
                        ? "#17B15E !important"
                        : i?.tr11_status === "Failed"
                          ? "#FF4D4F !important"
                          : "#e6af19 !important",
                      fontWeight: 600,
                    }}
                  >
                    {i?.tr11_status}
                  </Typography>

                </Stack>

                <InfoRow
                  label="Balance"
                  value={getFloatingValue(i?.tr11_amont)}
                  colorValue="#38bd1e !important"
                />
                <InfoRow
                  label="Date/Time"
                  value={moment.utc(i?.tr11_created_at).format("DD-MM-YYYY HH:mm:ss")}
                  colorValue="#aaa !important"
                />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ ...infoLabel }}>Transaction No.</Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography sx={{ ...infoValue }}>{i?.tr11_transacton_id}</Typography>
                    {/* <IconButton sx={{ p: 0 }} onClick={() => handleCopy(i?.tr11_transacton_id)}>
                      <ContentCopyIcon fontSize="small" sx={{ color: "#aaa" }} />
                    </IconButton> */}
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ ...infoLabel }}>Hash </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      sx={{ ...infoValue,  color: "#2ca2d1 !important", fontSize: "10px !important", mt: 2, cursor: "pointer", textDecorationLine: "underline" }}
                      onClick={() => i?.tr11_hash && window.open(`https://bscscan.com/tx/${i.tr11_hash}`, "_blank")}
                    >
                      {i?.tr11_hash

                        ? `${i.tr11_hash
                          .slice(0, 12)}...${i.tr11_hash
                            .slice(-4)}`
                        : "--"}

                    </Typography>

                  </Stack>
                </Stack>
              </Box>
            ))
          )}
          {data?.data?.length !==0 &&
            <Box
              sx={{
                mb: 2,
                borderRadius: 2,
                background: '#05080f',
                width: '92%',
                margin: 'auto',
                mt: 2,
              }}
            > <CustomToPagination page={page} setPage={setPage} data={data} />

            </Box>
          }
          {/* Show All / Show Less */}
          {/* {list.length > 3 && (
            <Button
              sx={style.paytmbtntwo}
              variant="outlined"
              onClick={() => setIsAllValue(!isAllValue)}
            >
              {isAllValue ? "Show Less" : "All History"}
            </Button>
          )} */}
        </Box>
      </Container>
    </>
  );
}

export default WithdrawHistory;

// Reusable Info Row
const InfoRow = ({ label, value, colorValue }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" >
    <Typography sx={{ ...infoLabel }}>{label}</Typography>
    <Typography sx={{ ...infoValue, color: colorValue || infoValue.color }}>{value}</Typography>
  </Stack>
);

const infoLabel = {
  color: "#888",
  fontSize: "13px",
  fontWeight: 600,
};

const infoValue = {
  fontSize: "13px",
  fontWeight: 600,
};

const style = {
  paytmbtntwo: {
    borderRadius: "20px",
    textTransform: "capitalize",
    mb: 4,
    width: "92%",
    mt: 2,
    mx: "auto",
    px: 2,
    py: 1.5,
    "&:hover": { border: "1px solid transparent" },
    color: "#fff",
    borderColor: "#fff",
  },
};
