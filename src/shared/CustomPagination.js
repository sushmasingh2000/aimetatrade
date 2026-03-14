import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton, Box, Typography } from "@mui/material";

const CustomToPagination = ({ setPage, page, data }) => {
  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currPage || 1;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        justifyItems: "flex-start",
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        mb: 10,
        // similar to bg-custom-gradient
        color: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          justifyItems: "flex-start",
          gap: 2,
          borderRadius: 2,
          // similar to bg-custom-gradient
          color: "#ffffff",
        }}
      >
        <Typography sx={{ fontSize: "10px !important" }}>
          Total Pages: <Typography component="span" sx={{ fontWeight: 600 }}>{totalPages}</Typography>
        </Typography>
        <Typography sx={{ fontSize: "10px !important" }}>
          Current Page: <Typography component="span" sx={{ fontWeight: 600 }}>{currentPage}</Typography>
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          justifyItems: "flex-start",
          gap: 2,
          borderRadius: 2,
          // similar to bg-custom-gradient
          color: "#ffffff",
        }}
      >
        <IconButton
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          sx={{
            color: "white",
            transition: "transform 0.2s",
            "&:hover": page > 1 ? { transform: "scale(1.1)" } : {},
            ...(page <= 1 && { opacity: 0.5, cursor: "not-allowed" }),
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          sx={{
            color: "white",
            transition: "transform 0.2s",
            "&:hover": page < totalPages ? { transform: "scale(1.1)" } : {},
            ...(page >= totalPages && { opacity: 0.5, cursor: "not-allowed" }),
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomToPagination;
