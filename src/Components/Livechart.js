import React from "react";
import { Container } from "@mui/material";
import ForexMarketTable from "./ForexMarketTable";

export default function Livechart() {
  return (
    <Container sx={{ px: "0px !important", paddingBottom: "60px" }}>
      <ForexMarketTable />
    </Container>
  );
}
