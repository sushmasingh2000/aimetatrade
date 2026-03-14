// import {
//   Skeleton,
//   Table,
//   TableBody,
//   TableContainer,
//   TableHead,
//   TableRow
// } from '@mui/material';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import { styled } from '@mui/material/styles';
// import React from 'react';

// const CustomTable = ({
//   tablehead,
//   tablerow,
//   className,
//   isLoading,
//   isTotal,
// }) => {
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [page, setPage] = React.useState(0);

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: theme.palette.common.black,
//       color: theme.palette.common.white,
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14
//     },
//   }));

//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:last-child td, &:last-child th': {
//       border: 0,
//     },
//   }));

//   const visibleRows = React.useMemo(
//     () => tablerow?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//     [page, rowsPerPage, tablerow]
//   );

//   return (
//     <>
//       <TableContainer className={className}>
//         <Table className='main_table_datas'
//           stickyHeader
//           aria-label="sticky table"
//           sx={{
//             borderCollapse: 'separate'
//           }}
//         >
//           <TableHead className=" tablemainhead">
//             <TableRow className=''>
//               {tablehead.map((column, i) => (
//                 <TableCell
//                   key={i}
//                   className="!text-black !font-bold  "
//                 >
//                   {column}
//                 </TableCell>
//               ))} 
//             </TableRow>
//           </TableHead>

//           <TableBody className="">
//             {/* ---------- LOADING ---------- */}
//             {isLoading ? (
//               [...Array(10)].map((_, index) => (
//                 <StyledTableRow key={index}>
//                   {tablehead.map((_, i) => (
//                     <TableCell key={i}>
//                       <Skeleton />
//                     </TableCell>
//                   ))}
//                 </StyledTableRow>
//               ))
//             ) : /* ---------- NO DATA ---------- */
//             !tablerow || tablerow.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={tablehead.length}
//                   className=" py-6 text-gray-600 font-semibold"
//                 >
//                   No Data Found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               /* ---------- DATA ROWS ---------- */
//               visibleRows.map((row, index) => (
//                 <StyledTableRow key={index}>
//                   {row.map((cell, i) => (
//                     <StyledTableCell
//                       key={i}
//                       className=" "
//                     >
//                       {cell}
//                     </StyledTableCell>
//                   ))}
//                 </StyledTableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

// export default CustomTable;
import {
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React from 'react';

const CustomTable = ({
  tablehead,
  tablerow,
  className,
  isLoading,
}) => {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <TableContainer className={className}>
      <Box className="main_taleb">
        <Table
          className=''
          stickyHeader
          aria-label="sticky table"
          sx={{ borderCollapse: 'separate' }}
        >
          <TableHead>
            <TableRow>
              {tablehead.map((column, i) => (
                <StyledTableCell sx={{background: "linear-gradient(90deg, #ad49ff, #7d18d2) !important"}} key={i} className="!font-bold !text-white ">
                  {column}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* ---------- LOADING ---------- */}
            {isLoading ? (
              [...Array(10)].map((_, index) => (
                <StyledTableRow key={index}>
                  {tablehead.map((_, i) => (
                    <StyledTableCell key={i}>
                      <Skeleton />
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))
            ) : /* ---------- NO DATA ---------- */
            !tablerow || tablerow.length === 0 ? (
              <TableRow>
                <StyledTableCell
                  colSpan={tablehead.length}
                  className="! text-white font-semibold text-center"
                >
                  No Data Found
                </StyledTableCell>
              </TableRow>
            ) : (
              /* ---------- DATA ROWS ---------- */
              tablerow.map((row, index) => (
                <StyledTableRow key={index}>
                  {row.map((cell, i) => (
                    <StyledTableCell key={i}>
                      {cell}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
};

export default CustomTable;
