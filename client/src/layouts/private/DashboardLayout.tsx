import {
  Box,
} from "@mui/material";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

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
