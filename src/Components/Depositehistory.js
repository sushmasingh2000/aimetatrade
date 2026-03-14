import {
  Box,
  Button,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiConnectorGet, apiConnectorPost } from '../services/apiconnector';
import { endpoint } from '../services/urls';
import CustomToPagination from '../shared/CustomPagination';
import CustomCircularProgress from '../shared/loder/CustomCircularProgress';
import SvgIcons from '../SvgIcons';
import { formatedDate } from '../utils/DateTime';
import { getFloatingValue } from '../utils/utilityFun';
import Header2 from './Layouts/Header2';
import moment from 'moment';

function DepositeHistory() {
  const [isAllValue, setIsAllValue] = useState(false);
  const [data, setData] = useState([]);
  const [from_date, setFrom_date] = useState('');
  const [to_date, setTo_date] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const ClaimFn = async (transaction) => {

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to claim this deposit?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17B15E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Claim it!',
      customClass: {
        icon: 'my-swal-icon',
        title: 'my-swal-title',
        content: 'my-swal-content',
        cancelButton: 'swal2-cancel-btn-red',
      }

    });

    if (result.isConfirmed) {
      setLoading(true);

      try {

        const res = await apiConnectorPost(endpoint?.claim_deposit, {
          trans_id: transaction
        });
        setLoading(false);

        if (res?.data?.success) {

          await Swal.fire({
            icon: 'success',
            title: 'Claimed!',
            text: res?.data?.msg || "Deposit claimed successfully",
            confirmButtonColor: '#17B15E'
          });

          DepositeHistoryFn(); // refresh list

        } else {
          setLoading(false);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: res?.data?.msg || "Claim failed",
          });

        }

      } catch (error) {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });

      }
    }
  };



  const DepositeHistoryFn = async () => {
    setLoading(true);
    try {
      const res = await apiConnectorPost(endpoint?.get_transaction_history, {
        start_date: from_date,
        end_date: to_date,
        search,
        page,
        count: 10,
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
    DepositeHistoryFn();
  }, [page]);


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

      <Box
        sx={{ minHeight: "100vh", bgcolor: "#1d1b1b", pb: 4 }}
      >
        <Header2
          title="Deposit History"
        />

        <CustomCircularProgress isLoading={loading} />
        <SvgIcons />

        <Container
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: '100vh',
            pb: 4,
          }}
        >

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px="20px"
            mt="10px"
          >
            <Typography
              sx={{

              }}
            >
              Total Deposit :
            </Typography>
            <Typography sx={{ color: "#38bd1e !important", fontWeight: 600, mr: 2,  }}>
              $ {getFloatingValue(member_dashboard?.total_spot_deposit)}
            </Typography>
          </Stack>
          {/* Filter Section */}
          {/* <Box className="flex flex-col gap-4 items-center mb-4">
          <span className="font-bold text-white">From:</span>
          <TextField
            type="date"
            value={from_date}
            onChange={(e) => setFrom_date(e.target.value)}
            size="small"
            sx={{ background: '#021244', input: { color: 'white' } }}
          />

          <span className="font-bold text-white">To:</span>
          <TextField
            type="date"
            value={to_date}
            onChange={(e) => setTo_date(e.target.value)}
            size="small"
            sx={{ background: '#021244', input: { color: 'white' } }}
          />

          <TextField
            type="search"
            placeholder="Search by user id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ background: '#021244', input: { color: 'white' } }}
          />

          <Button
            onClick={() => {
              setPage(1);
              DepositeHistoryFn();
            }}
            variant="contained"
            startIcon={<FilterAlt />}
          >
            Filter
          </Button>
        </Box> */}

          {/* No Data State */}
          {!loading && data?.data?.length === 0 && (
            <Box
              sx={{
                mt: 6,
                mx: 'auto',
                width: '92%',
                p: 4,
                borderRadius: 2,
                background: '#05080f',
                textAlign: 'center',
                color: '#fff',
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                No Deposit History Found
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#aaa', mt: 1 }}>
                You haven’t made any Deposit yet.
              </Typography>
            </Box>
          )}

          {/* Depositeal Data */}
          {data.data?.length > 0 &&
            data?.data?.map((i, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 1,
                  borderRadius: 2,
                  background: '#05080f',
                  width: '92%',
                  margin: 'auto',
                  mt: 1,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 1, borderBottom: '1px solid #efefef' }}
                >
                  <Typography
                    sx={{
                      pb: 1,
                      borderRadius: 1,
                      color: '#fff',
                      fontWeight: 500,
                    }}
                  >
                    Status
                  </Typography>
                  {(i.tr_status === "Pending" || !i.tr_status) ?
                    <Button
                      variant='contained'
                      size='small'
                      onClick={() => ClaimFn(i?.m06_trans_id)}
                    >
                      Claim
                    </Button>

                    :
                    <Typography sx={{ fontSize: "12px", color: "#44d10d !important" }}>
                      {i.tr_status === "Success" ? "SUCCESS" : i.tr_status}</Typography>
                  }
                </Stack>

                <InfoRow label="Balance" value={getFloatingValue(i?.tr_amount)} colorValue="#38dd40 !important" />
                <InfoRow label="Date/Time" value={formatedDate(moment, i?.tr_created_at)}
                colorValue="#aaa !important" />

                {/* Transaction ID with copy */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ ...infoLabel }}>Transaction No.</Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography sx={{ ...infoValue }}>{i?.tr_trans_id}</Typography>
                    {/* <IconButton sx={{ p: 0 }} onClick={() => handleCopy(i?.m06_trans_id)}>
                    <ContentCopyIcon sx={{ color: '#888', width: 15, ml: 1 }} />
                  </IconButton> */}
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ ...infoLabel }}>Wallet Address</Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography sx={{ ...infoValue }}>
                      {i?.tr_from_wallet
                        ? `${i.tr_from_wallet.slice(0, 14)}...${i.tr_from_wallet.slice(-4)}`
                        : "--"}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ ...infoLabel }}>hash</Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography sx={{
                      ...infoValue, color: "#2ca2d1 !important",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                      onClick={() =>
                        i?.tr_hex_code &&
                        window.open(
                          `https://bscscan.com/tx/${i.tr_hex_code}`,
                          "_blank"
                        )
                      }>
                      {i?.tr_hex_code
                        ? `${i.tr_hex_code.slice(0, 12)}...${i.tr_hex_code.slice(-4)}`
                        : "--"}
                    </Typography>
                  </Stack>
                </Stack>

              </Box>
            ))}
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
              {isAllValue ? 'Show Less' : 'All History'}
            </Button>
          )} */}
        </Container>
      </Box>
    </>
  );
}

export default DepositeHistory;

// Reusable Info Row
const InfoRow = ({ label, value, colorValue }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" >
    <Typography sx={{ ...infoLabel }}>{label}</Typography>
    <Typography sx={{ ...infoValue, color: colorValue || infoValue.color  }}>{value}</Typography>
  </Stack>
);

const infoLabel = {
  color: '#888',
  fontSize: '13px',
  // fontWeight: 600,
};

const infoValue = {
  fontSize: '13px',
  // fontWeight: 600,
};

