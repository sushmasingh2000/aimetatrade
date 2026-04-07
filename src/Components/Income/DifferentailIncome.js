import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { ArrowLeft } from '@react-vant/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { apiConnectorPost } from '../../services/apiconnector';
import { endpoint } from '../../services/urls';
import SvgIcons from '../../SvgIcons';
import Header2 from '../Layouts/Header2';
import CustomCircularProgress from '../../shared/loder/CustomCircularProgress';
import toast from 'react-hot-toast';
import CustomToPagination from '../../shared/CustomPagination';
import { getFloatingValue } from '../../utils/utilityFun';

function DefferentailIncome() {
  const [isAllValue, setIsAllValue] = useState(false);
  const [data, setData] = useState([]);
  const [from_date, setFrom_date] = useState('');
  const [to_date, setTo_date] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const DefferentialIncome = async () => {
    setLoading(true);
    try {
      const res = await apiConnectorPost(endpoint?.get_report_details, {
        start_date: from_date,
        end_date: to_date,
        search,
        page,
        count:10,
        sub_label: 'RANK',
        main_label: 'IN',
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
    DefferentialIncome();
  }, [page]);


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied Successfully !" ,{id: 1})
  };

  return (

    <>
      <Header2 
       title="Community  Bonus "
         />

      <CustomCircularProgress isLoading={loading} />
      <SvgIcons />

     <Container
            sx={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: '100vh',
            }}
          >
    
    
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
                  No Community  Bonus  Found
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#aaa', mt: 1 }}>
                  You haven’t made any Community  Bonus  yet.
                </Typography>
              </Box>
            )}
    
            {/* Depositeal Data */}
            {data?.data?.length > 0 &&
              data?.data?.map((i, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 1,
                    px: 2,
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
                    sx={{ borderBottom: '1px solid #efefef' }}
                  >
                    <Typography
                      sx={{
                        borderRadius: 1,
                        color: '#fff',
                        fontSize: "13px !important",
                      }}
                    >UID
                    </Typography>
                    <Typography sx={{  fontSize: "13px !important", color: "#ad49ff !important"}}>
           
                    {i?.tr07_description?.split(' ')?.[i?.tr07_description?.split(' ')?.length - 1]}
                
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: "2px", }}>
                    <Typography sx={{ ...infoLabel }}>Bonus</Typography>
                    <Typography sx={{ ...infoValue, color: "#38bd1e !important " }}>{getFloatingValue(i?.tr07_tr_amount)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" >
                    <Typography sx={{ ...infoLabel }}>Date/Time</Typography>
                    <Typography sx={{ ...infoValue , color: "#aaa !important"}}>{moment.utc(i?.tr07_created_at).format('DD-MM-YYYY HH:mm:ss')}</Typography>
                  </Stack>
    
                  {/* Transaction ID with copy */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ ...infoLabel }}>Transaction No.</Typography>
                    <Stack direction="row" alignItems="center">
                      <Typography sx={{ ...infoValue, fontWeight: "300 !important" }}>{i?.tr07_trans_id}</Typography>
                      {/* <IconButton sx={{ p: 0 }} onClick={() => handleCopy(i?.tr07_trans_id)}>
                        <ContentCopyIcon sx={{ color: '#888', width: 15, ml: 1 }} />
                      </IconButton> */}
                    </Stack>
                  </Stack>
                </Box>
              ))}
    
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
                    <CustomToPagination setPage={setPage} page={page} data={data} />
            
          </Container>
    </>
  );
}

export default DefferentailIncome;

// Reusable Info Row
const InfoRow = ({ label, value, colorValue }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
    <Typography sx={{ ...infoLabel }}>{label}</Typography>
    <Typography sx={{ ...infoValue, color: colorValue || infoValue.color }}>{value}</Typography>
  </Stack>
);

const infoLabel = {
  color: '#888',
  fontSize: '13px',
  fontWeight: 600,
};

const infoValue = {
  fontSize: '13px',
  fontWeight: 600,
};

const style = {
  paytmbtntwo: {
    borderRadius: '20px',
    textTransform: 'capitalize',
    mb: 4,
    width: '92%',
    mt: 2,
    mx: 'auto',
    px: 2,
    py: 1.5,
    '&:hover': { border: '1px solid transparent' },
    color: '#fff',
    borderColor: '#fff',
  },
};
