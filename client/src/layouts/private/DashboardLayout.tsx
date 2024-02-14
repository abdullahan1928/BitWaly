import {
  Box,
} from "@mui/material";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>

      <Header open={open} setOpen={setOpen} />

      <Sidebar open={open} />

    </Box>
  );
};

export default DashboardLayout;
